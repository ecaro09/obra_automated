import { useState } from 'react';
import { Product } from '../types';

export const useComparison = () => {
  const [compareList, setCompareList] = useState<Product[]>([]);

  const toggleComparison = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert("You can compare up to 4 items at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (id: string) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  return {
    compareList,
    toggleComparison,
    removeFromComparison,
  };
};