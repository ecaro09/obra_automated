import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types';
import { PRODUCTS_DB } from '@/constants';

export const useProducts = () => {
  const [userProducts, setUserProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('obra_userProducts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load user products", e);
      return [];
    }
  });

  const [productOverrides, setProductOverrides] = useState<Record<string, Product>>(() => {
    try {
      const saved = localStorage.getItem('obra_productOverrides');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('obra_userProducts', JSON.stringify(userProducts));
  }, [userProducts]);

  useEffect(() => {
    localStorage.setItem('obra_productOverrides', JSON.stringify(productOverrides));
  }, [productOverrides]);

  // Combine static DB with user-added products and apply overrides
  const allProducts = useMemo(() => {
    const dbProducts = PRODUCTS_DB.map((p: Product) => {
      const overriddenProduct = productOverrides[p.id] || p;
      return { ...overriddenProduct };
    });
    return [...userProducts, ...dbProducts];
  }, [userProducts, productOverrides]);

  // Centralized function to update product image or any other product property in state
  const updateProductInState = (id: string, updates: Partial<Product>) => {
    // 1. Check User Products
    if (userProducts.some((p: Product) => p.id === id)) {
        setUserProducts((prev: Product[]) => prev.map((p: Product) => p.id === id ? { ...p, ...updates } : p));
        return;
    }
    // 2. Check Product Overrides (DB product that was edited)
    if (productOverrides[id]) {
        setProductOverrides((prev: Record<string, Product>) => ({
            ...prev,
            [id]: { ...prev[id], ...updates }
        }));
        return;
    }
    // 3. If it's a DB product not yet overridden, create an override
    const dbProduct = PRODUCTS_DB.find((p: Product) => p.id === id);
    if (dbProduct) {
        setProductOverrides((prev: Record<string, Product>) => ({
            ...prev,
            [id]: { ...dbProduct, ...updates }
        }));
    }
  };

  const handleSaveProduct = (product: Product) => {
    const isUserProduct = userProducts.some((p: Product) => p.id === product.id);
    
    if (isUserProduct) {
        setUserProducts((prev: Product[]) => prev.map((p: Product) => p.id === product.id ? product : p));
    } else {
        const isDbProduct = PRODUCTS_DB.some((p: Product) => p.id === product.id);
        if (isDbProduct) {
            setProductOverrides((prev: Record<string, Product>) => ({ ...prev, [product.id]: product }));
        } else {
            setUserProducts((prev: Product[]) => [product, ...prev]);
        }
    }
  };

  return {
    allProducts,
    handleSaveProduct,
    updateProductInState,
  };
};