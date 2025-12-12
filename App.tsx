import React, { useState } from 'react';
import { Navbar } from './src/components/Navbar';
import { ChatAssistant } from './src/components/ChatAssistant';
import { ProductCatalogSection } from './src/components/ProductCatalogSection';
import { ModalManager } from './src/components/ModalManager';
import { useProducts } from './src/hooks/useProducts';
import { useCart } from './src/hooks/useCart';
import { useComparison } from './src/hooks/useComparison';
import { useSearchAndFilter } from './src/hooks/useSearchAndFilter';
import { useBatchImageGeneration } from './src/hooks/useBatchImageGeneration';
import { Product } from './src/types';
import { Scale } from 'lucide-react';

function App() {
  // --- Product Data Management ---
  const { allProducts, handleSaveProduct, updateProductInState } = useProducts();

  // --- Cart Management ---
  const { cart, cartCount, addToCart, updateCartQty, removeFromCart } = useCart();

  // --- Comparison Management ---
  const { compareList, toggleComparison, removeFromComparison } = useComparison();

  // --- Search and Filter Management ---
  const { 
    searchTerm, selectedCategory, isAISearching, aiMatches, 
    categories, filteredProducts, 
    handleSearchChange, handleAISearch, clearSearch, setSelectedCategory 
  } = useSearchAndFilter(allProducts);

  // --- Batch Image Generation Management ---
  const {
    isBatchMode, selectedBatchIds, batchStatuses, isBatchGenerating,
    toggleBatchMode, handleToggleBatchSelect, handleSelectAllMissingImages, handleBatchGenerate
  } = useBatchImageGeneration(allProducts, updateProductInState);

  // --- Modal States ---
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // --- Handlers for Modals and Product Actions ---
  const handleProductClick = (product: Product) => {
    if (!isBatchMode) {
        setSelectedProduct(product);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddProductModalOpen(true);
  };

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setIsQuoteModalOpen(true)}
        onAddProductClick={handleAddProductClick}
      />

      <ProductCatalogSection
        allProducts={allProducts}
        filteredProducts={filteredProducts}
        categories={categories}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        isAISearching={isAISearching}
        aiMatches={aiMatches}
        handleSearchChange={handleSearchChange}
        handleAISearch={handleAISearch}
        clearSearch={clearSearch}
        setSelectedCategory={setSelectedCategory}
        onAddProductToCart={addToCart}
        onProductClick={handleProductClick}
        onToggleComparison={toggleComparison}
        onEditProduct={handleEditProduct}
        onUpdateProductImageInState={(id, newUrl) => updateProductInState(id, { image: newUrl })}
        compareList={compareList}
        isBatchMode={isBatchMode}
        selectedBatchIds={selectedBatchIds}
        batchStatuses={batchStatuses}
        isBatchGenerating={isBatchGenerating}
        toggleBatchMode={toggleBatchMode}
        handleToggleBatchSelect={handleToggleBatchSelect}
        handleSelectAllMissingImages={handleSelectAllMissingImages}
        handleBatchGenerate={handleBatchGenerate}
      />

      <footer className="bg-white border-t border-slate-200 py-12 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} OBRA Furniture. All rights reserved.</p>
          <p className="mt-1">Quality Furniture Solutions</p>
        </div>
      </footer>

      {/* Floating Compare Button */}
      {compareList.length > 0 && !isBatchMode && (
        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 transition-all hover:scale-105 active:scale-95 animate-in slide-in-from-bottom-10"
        >
          <Scale className="w-5 h-5" />
          <span className="font-bold">Compare ({compareList.length})</span>
        </button>
      )}

      <ModalManager
        // Quote Modal Props
        isQuoteModalOpen={isQuoteModalOpen}
        onCloseQuoteModal={() => setIsQuoteModalOpen(false)}
        cart={cart}
        updateCartQty={updateCartQty}
        removeFromCart={removeFromCart}
        // Product Details Modal Props
        selectedProduct={selectedProduct}
        onCloseProductDetailsModal={() => setSelectedProduct(null)}
        onAddToCartFromDetails={addToCart}
        // Add/Edit Product Modal Props
        isAddProductModalOpen={isAddProductModalOpen}
        onCloseAddProductModal={handleCloseAddProductModal}
        onSaveProduct={handleSaveProduct}
        editingProduct={editingProduct}
        // Comparison Modal Props
        isCompareModalOpen={isCompareModalOpen}
        onCloseCompareModal={() => setIsCompareModalOpen(false)}
        compareList={compareList}
        onRemoveFromComparison={removeFromComparison}
        onAddToCartFromComparison={addToCart}
      />

      <ChatAssistant products={allProducts} />
    </div>
  );
}

export default App;