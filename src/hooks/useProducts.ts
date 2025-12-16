import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client

export const useProducts = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setAllProducts([]); // Clear products on error
      } else {
        setAllProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchProducts();

    // Set up real-time subscription for products
    const channel = supabase
      .channel('products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Change received!', payload);
        fetchProducts(); // Re-fetch products on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSaveProduct = async (product: Product) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      alert("You must be logged in to add or edit products.");
      return;
    }

    const productWithSellerId = { ...product, seller_id: user.user.id };

    if (product.created_at) { // Check if product has a created_at field, indicating it's an existing product
      // Update existing product
      const { data, error } = await supabase
        .from('products')
        .update(productWithSellerId)
        .eq('id', product.id)
        .select();

      if (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product: ' + error.message);
      } else {
        console.log('Product updated:', data);
      }
    } else {
      // Insert new product
      const { data, error } = await supabase
        .from('products')
        .insert(productWithSellerId)
        .select();

      if (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product: ' + error.message);
      } else {
        console.log('Product added:', data);
      }
    }
  };

  // Centralized function to update product image or any other product property in state
  // This will now trigger a Supabase update
  const updateProductInState = async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating product in state:', error);
      alert('Failed to update product image: ' + error.message);
    } else {
      console.log('Product image updated in DB:', data);
    }
  };

  return {
    allProducts,
    handleSaveProduct,
    updateProductInState,
    loading,
    error,
  };
};