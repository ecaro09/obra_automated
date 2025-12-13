import type React from 'react';
import { Dashboard } from '@/components/Dashboard';
import { Product } from '@/types';
import { Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { ProductSearchAndFilter } from '@/components/ProductSearchAndFilter';
import { ProductGrid } from '@/components/ProductGrid';
import { BatchStatus } from '@/components/ProductCard'; // Import BatchStatus type

interface ProductCatalogSectionProps {
  allProducts: Product[];
  filteredProducts: Product[];
  categories: string[];
  searchTerm: string;
  selectedCategory: string;
  isAISearching: boolean;
  aiMatches: string[] | null;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAISearch: () => void;
  clearSearch: () => void;
  setSelectedCategory: (category: string) => void;
  // Product Actions
  onAddProductToCart: (product: Product, quantity: number) => void;
  onProductClick: (product: Product) => void;
  onToggleComparison: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onUpdateProductImageInState: (id: string, newUrl: string) => void;
  compareList: Product[];
  // Batch Mode Props
  isBatchMode: boolean;
  selectedBatchIds: Set<string>;
  batchStatuses: Record<string, BatchStatus>;
  isBatchGenerating: boolean;
  toggleBatchMode: () => void;
  handleToggleBatchSelect: (id: string) => void;
  handleSelectAllMissingImages: () => void;
  handleBatchGenerate: () => void;
}

export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({
  allProducts,
  filteredProducts,
  categories,
  searchTerm,
  selectedCategory,
  isAISearching,
  aiMatches,
  handleSearchChange,
  handleAISearch,
  clearSearch,
  setSelectedCategory,
  onAddProductToCart,
  onProductClick,
  onToggleComparison,
  onEditProduct,
  onUpdateProductImageInState,
  compareList,
  isBatchMode,
  selectedBatchIds,
  batchStatuses,
  isBatchGenerating,
  toggleBatchMode,
  handleToggleBatchSelect,
  handleSelectAllMissingImages,
  handleBatchGenerate,
}: ProductCatalogSectionProps) => {
  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden pb-32">
      
      {/* Hero / Header */}
      <div className="mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="mt-2 text-slate-500">
            Browse our premium collection of office and home furniture.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col items-end gap-2">
           {aiMatches !== null && (
             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Search Active
             </span>
           )}
           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
              {filteredProducts.length} Items Found
           </span>
        </div>
      </div>

      {/* Dashboard Overview (Inventory Stats) */}
      {!isBatchMode && !searchTerm && selectedCategory === 'All' && (
          <Dashboard products={allProducts} />
      )}

      {/* Search and Filter Section */}
      <ProductSearchAndFilter
        allProducts={allProducts}
        categories={categories}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        isAISearching={isAISearching}
        aiMatches={aiMatches}
        handleSearchChange={handleSearchChange}
        handleAISearch={handleAISearch}
        clearSearch={clearSearch}
        setSelectedCategory={setSelectedCategory}
        isBatchMode={isBatchMode}
        toggleBatchMode={toggleBatchMode}
      />

      {/* Product Grid */}
      <ProductGrid
        filteredProducts={filteredProducts}
        onAddProductToCart={onAddProductToCart}
        onProductClick={onProductClick}
        onToggleComparison={onToggleComparison}
        onEditProduct={onEditProduct}
        onUpdateProductImageInState={onUpdateProductImageInState}
        compareList={compareList}
        isBatchMode={isBatchMode}
        selectedBatchIds={selectedBatchIds}
        batchStatuses={batchStatuses}
        handleToggleBatchSelect={handleToggleBatchSelect}
        clearSearch={clearSearch}
      />

      {/* Batch Actions Toolbar */}
      {isBatchMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 animate-in slide-in-from-bottom-full duration-300">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-800 whitespace-nowrap">
                        {selectedBatchIds.size} Selected
                    </span>
                    <button
                        onClick={handleSelectAllMissingImages}
                        className="text-sm text-teal-600 font-semibold hover:underline flex items-center gap-1"
                    >
                        <ImageIcon className="w-4 h-4" /> Select All Missing Images
                    </button>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={toggleBatchMode}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        disabled={isBatchGenerating}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBatchGenerate}
                        disabled={selectedBatchIds.size === 0 || isBatchGenerating}
                        className="flex-1 sm:flex-none px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isBatchGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Images
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      )}
    </main>
  );
};