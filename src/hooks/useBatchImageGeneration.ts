import { useState } from 'react';
import { Product } from '@/src/types';
import { generateProductImage } from '@/src/services/gemini';

export type BatchStatus = 'idle' | 'generating' | 'success' | 'error';

export const useBatchImageGeneration = (
  allProducts: Product[],
  updateProductInState: (id: string, updates: Partial<Product>) => void
) => {
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<Set<string>>(new Set());
  const [batchStatuses, setBatchStatuses] = useState<Record<string, BatchStatus>>({});
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  const toggleBatchMode = () => {
    setIsBatchMode(prev => !prev);
    setSelectedBatchIds(new Set());
    setBatchStatuses({});
  };

  const handleToggleBatchSelect = (id: string) => {
    setSelectedBatchIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  };

  const handleSelectAllMissingImages = () => {
    const missingImageIds = allProducts
        .filter(p => p.image.includes('placehold.co'))
        .map(p => p.id);
    
    setSelectedBatchIds(new Set(missingImageIds));
  };

  const handleBatchGenerate = async () => {
    if (selectedBatchIds.size === 0) return;
    
    setIsBatchGenerating(true);
    
    const initialStatuses: Record<string, BatchStatus> = {};
    selectedBatchIds.forEach(id => {
        initialStatuses[id] = 'generating';
    });
    setBatchStatuses(initialStatuses);

    const promises = Array.from(selectedBatchIds).map(async (id: string) => {
        const product = allProducts.find(p => p.id === id);
        if (!product) return;

        try {
            const newUrl = await generateProductImage(product.name, product.description, product.category);
            if (newUrl) {
                updateProductInState(id, { image: newUrl });
                setBatchStatuses(prev => ({ ...prev, [id]: 'success' }));
            } else {
                setBatchStatuses(prev => ({ ...prev, [id]: 'error' }));
            }
        } catch (error) {
            console.error(`Error generating image for ${id}:`, error);
            setBatchStatuses(prev => ({ ...prev, [id]: 'error' }));
        }
    });

    await Promise.all(promises);
    setIsBatchGenerating(false);
    
    setTimeout(() => {
        setBatchStatuses(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(key => {
                if (next[key] === 'success') delete next[key];
            });
            return next;
        });
        setSelectedBatchIds(new Set());
    }, 2000);
  };

  return {
    isBatchMode,
    selectedBatchIds,
    batchStatuses,
    isBatchGenerating,
    toggleBatchMode,
    handleToggleBatchSelect,
    handleSelectAllMissingImages,
    handleBatchGenerate,
  };
};