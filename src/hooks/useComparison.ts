import type React from 'react';
import { useState } from 'react';
import { Product } from '@/types';

export const useComparison = () => {
  const [compareList, setCompareList] = useState<Product[]>([]);

  const toggleComparison = (product: Product) => {
    setCompareList((prev: Product[]) => {
      const exists = prev.find((p: Product) => p.id === product.id);
      if (exists) {
        return prev.filter((p: Product) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert("You can compare up to 4 items at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (id: string) => {
    setCompareList((prev: Product[]) => prev.filter((p: Product) => p.id !== id));
  };

  return {
    compareList,
    toggleComparison,
    removeFromComparison,
  };
};