import type React from 'react';
import { ProductCard, BatchStatus } from '@/components/ProductCard';
import { Product } from '@/types';
import { Search } from 'lucide-react';

interface ProductGridProps {
  filteredProducts: Product[];
  onAddProductToCart: (product: Product, quantity: number) => void;
  onProductClick: (product: Product) => void;
  onToggleComparison: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onUpdateProductImageInState: (id: string, newUrl: string) => void;
  compareList: Product[];
  isBatchMode: boolean;
  selectedBatchIds: Set<string>;
  batchStatuses: Record<string, BatchStatus>;
  handleToggleBatchSelect: (id: string) => void;
  clearSearch: () => void; // For the "No products found" button
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  filteredProducts,
  onAddProductToCart,
  onProductClick,
  onToggleComparison,
  onEditProduct,
  onUpdateProductImageInState,
  compareList,
  isBatchMode,
  selectedBatchIds,
  batchStatuses,
  handleToggleBatchSelect,
  clearSearch,
}: ProductGridProps) => {
  return (
    <>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={onAddProductToCart} 
              onClick={onProductClick}
              onCompare={onToggleComparison}
              onEdit={onEditProduct}
              onUpdateImageInState={onUpdateProductImageInState}
              isComparing={compareList.some((p: Product) => p.id === product.id)}
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
    </>
  );
};