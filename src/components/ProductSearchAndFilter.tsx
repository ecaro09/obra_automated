import React from 'react';
import { Search, Sparkles, Loader2, XCircle, Layers } from 'lucide-react';
import { Product } from '@/types';

interface ProductSearchAndFilterProps {
  allProducts: Product[]; // Needed for categories
  categories: string[];
  searchTerm: string;
  selectedCategory: string;
  isAISearching: boolean;
  aiMatches: string[] | null;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAISearch: () => void;
  clearSearch: () => void;
  setSelectedCategory: (category: string) => void;
  isBatchMode: boolean;
  toggleBatchMode: () => void;
}

export const ProductSearchAndFilter: React.FC<ProductSearchAndFilterProps> = ({
  categories,
  searchTerm,
  selectedCategory,
  isAISearching,
  aiMatches,
  handleSearchChange,
  handleAISearch,
  clearSearch,
  setSelectedCategory,
  isBatchMode,
  toggleBatchMode,
}) => {
  return (
    <>
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
    </>
  );
};