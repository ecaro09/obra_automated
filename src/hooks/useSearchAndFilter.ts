import type React from 'react';
import { useState, useMemo } from 'react';
import { Product } from '@/types';
import { searchProducts } from '@/services/gemini';

export const useSearchAndFilter = (allProducts: Product[]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAISearching, setIsAISearching] = useState<boolean>(false);
  const [aiMatches, setAiMatches] = useState<string[] | null>(null);

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(allProducts.map((p: Product) => p.category)))],
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    if (aiMatches !== null) {
      return allProducts.filter((p: Product) => aiMatches.includes(p.id));
    }

    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      return selectedCategory === 'All' 
        ? allProducts 
        : allProducts.filter((p: Product) => p.category === selectedCategory);
    }

    const searchTokens = term.split(/\s+/).filter((t: string) => t.length > 0);

    return allProducts.filter((product: Product) => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      const searchableText = `
        ${product.name} 
        ${product.description} 
        ${product.category} 
        ${product.id}
        ${product.sku || ''}
      `.toLowerCase();

      return searchTokens.every((token: string) => searchableText.includes(token));
    });
  }, [searchTerm, selectedCategory, allProducts, aiMatches]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (aiMatches !== null) {
      setAiMatches(null);
    }
  };

  const handleAISearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsAISearching(true);
    setAiMatches(null);

    try {
      const matches = await searchProducts(searchTerm, allProducts);
      setAiMatches(matches);
    } catch (error) {
      console.error("AI Search Failed", error);
    } finally {
      setIsAISearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setAiMatches(null);
    setSelectedCategory('All');
  };

  return {
    searchTerm,
    selectedCategory,
    isAISearching,
    aiMatches,
    categories,
    filteredProducts,
    handleSearchChange,
    handleAISearch,
    clearSearch,
    setSelectedCategory,
  };
};