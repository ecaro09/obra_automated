import React from 'react';
import { ProductCard, BatchStatus } from './ProductCard';
import { Dashboard } from './Dashboard';
import { Product } from '../types';
import { Search, Sparkles, Loader2, XCircle, Layers, Image as ImageIcon } from 'lucide-react';

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
}) => {
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

      {/* Search Bar & Batch Toggle */}
      <div className="mb-8">
        <div className="flex gap-3 max-w-4xl mx-auto sm:mx-0">
          <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              </div>
              <input
              type="text"
              className="block w-full pl-11 pr-32 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm hover:shadow-md transition-all duration-200 text-base"
              placeholder="Ask AI: 'office tables under 15k with drawers'..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
              />
              
              <div className="absolute inset-y-0 right-2 flex items-center gap-1">
              {searchTerm && (
                  <button
                  onClick={clearSearch}
                  className="p-2 text-slate-300 hover:text-slate-500 transition-colors"
                  title="Clear Search"
                  >
                  <XCircle className="w-5 h-5" />
                  </button>
              )}
              
              <button
                  onClick={handleAISearch}
                  disabled={isAISearching || !searchTerm.trim()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isAISearching 
                      ? 'bg-slate-100 text-slate-400 cursor-wait' 
                      : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-md active:scale-95'
                  }`}
                  title="Use AI to find products based on intent"
              >
                  {isAISearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                  <Sparkles className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">AI Search</span>
              </button>
              </div>
          </div>

          <button
              onClick={toggleBatchMode}
              className={`flex items-center justify-center p-4 rounded-2xl border transition-all duration-200 shadow-sm ${
                  isBatchMode 
                  ? 'bg-teal-50 border-teal-500 text-teal-700' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
              title="Batch Image Generation Mode"
          >
              <Layers className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex space-x-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={onAddProductToCart} 
              onClick={onProductClick}
              onCompare={onToggleComparison}
              onEdit={onEditProduct}
              onUpdateImageInState={onUpdateProductImageInState}
              isComparing={compareList.some(p => p.id === product.id)}
              // Batch Props
              isBatchMode={isBatchMode}
              isSelected={selectedBatchIds.has(product.id)}
              onToggleSelect={handleToggleBatchSelect}
              batchStatus={batchStatuses[product.id]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 p-4 rounded-full inline-block mb-4">
             <Search className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 text-lg font-medium">No products found.</p>
          <p className="text-slate-400 text-sm mt-1">Try searching for something else or adjusting filters.</p>
          <button 
            onClick={clearSearch}
            className="mt-6 text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all"
          >
            View All Products
          </button>
        </div>
      )}

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