import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import { searchProducts } from '@/services/gemini';

export const useSearchAndFilter = (allProducts: Product[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiMatches, setAiMatches] = useState<string[] | null>(null);

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(allProducts.map(p => p.category)))],
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    if (aiMatches !== null) {
      return allProducts.filter(p => aiMatches.includes(p.id));
    }

    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      return selectedCategory === 'All' 
        ? allProducts 
        : allProducts.filter(p => p.category === selectedCategory);
    }

    const searchTokens = term.split(/\s+/).filter(t => t.length > 0);

    return allProducts.filter(product => {
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

      return searchTokens.every(token => searchableText.includes(token));
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