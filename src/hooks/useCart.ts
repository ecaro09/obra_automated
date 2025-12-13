import React, { useState, useMemo } from 'react';
import { CartItem, Product } from '@/types';
import { calculateFinalPrice } from '@/utils/pricingUtils';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartCount = useMemo(() => cart.reduce((a: number, b: CartItem) => a + b.quantity, 0), [cart]);

  const addToCart = (product: Product, quantity: number = 1, selectedVariants?: Record<string, string>, priceOverride?: number) => {
    setCart((prev: CartItem[]) => {
      const variantKey = selectedVariants ? JSON.stringify(selectedVariants) : '';
      
      const existingIndex = prev.findIndex((item: CartItem) => 
        item.id === product.id && 
        JSON.stringify(item.selectedVariants || {}) === (variantKey || '{}')
      );

      const basePrice = priceOverride !== undefined ? priceOverride : product.price;

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        newCart[existingIndex].finalPrice = calculateFinalPrice(basePrice);
        return newCart;
      }
      
      return [...prev, { 
        ...product, 
        quantity: quantity, 
        finalPrice: calculateFinalPrice(basePrice),
        selectedVariants
      }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev: CartItem[]) => prev.map((item: CartItem) => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev: CartItem[]) => prev.filter((item: CartItem) => item.id !== id));
  };

  return {
    cart,
    cartCount,
    addToCart,
    updateCartQty,
    removeFromCart,
  };
};