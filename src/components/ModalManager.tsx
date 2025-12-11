import React from 'react';
import { QuoteModal } from '@/src/components/QuoteModal';
import { ProductDetailsModal } from '@/src/components/ProductDetailsModal';
import { AddProductModal } from '@/src/components/AddProductModal';
import { ComparisonModal } from '@/src/components/ComparisonModal';
import { Product, CartItem } from '@/src/types';

interface ModalManagerProps {
  // Quote Modal
  isQuoteModalOpen: boolean;
  onCloseQuoteModal: () => void;
  cart: CartItem[];
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;

  // Product Details Modal
  selectedProduct: Product | null;
  onCloseProductDetailsModal: () => void;
  onAddToCartFromDetails: (product: Product, quantity: number, selectedVariants?: Record<string, string>, priceOverride?: number) => void;

  // Add/Edit Product Modal
  isAddProductModalOpen: boolean;
  onCloseAddProductModal: () => void;
  onSaveProduct: (product: Product) => void;
  editingProduct: Product | null;

  // Comparison Modal
  isCompareModalOpen: boolean;
  onCloseCompareModal: () => void;
  compareList: Product[];
  onRemoveFromComparison: (id: string) => void;
  onAddToCartFromComparison: (product: Product) => void;
}

export const ModalManager: React.FC<ModalManagerProps> = ({
  isQuoteModalOpen,
  onCloseQuoteModal,
  cart,
  updateCartQty,
  removeFromCart,
  selectedProduct,
  onCloseProductDetailsModal,
  onAddToCartFromDetails,
  isAddProductModalOpen,
  onCloseAddProductModal,
  onSaveProduct,
  editingProduct,
  isCompareModalOpen,
  onCloseCompareModal,
  compareList,
  onRemoveFromComparison,
  onAddToCartFromComparison,
}) => {
  return (
    <>
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={onCloseQuoteModal} 
        cart={cart}
        updateQty={updateCartQty}
        remove={removeFromCart}
      />

      <ProductDetailsModal 
        isOpen={!!selectedProduct}
        onClose={onCloseProductDetailsModal}
        product={selectedProduct}
        onAddToCart={onAddToCartFromDetails}
      />

      <AddProductModal 
        isOpen={isAddProductModalOpen}
        onClose={onCloseAddProductModal}
        onSave={onSaveProduct}
        productToEdit={editingProduct}
      />

      <ComparisonModal
        isOpen={isCompareModalOpen}
        onClose={onCloseCompareModal}
        products={compareList}
        onRemove={onRemoveFromComparison}
        onAddToCart={onAddToCartFromComparison}
      />
    </>
  );
};