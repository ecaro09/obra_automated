import React from 'react';
import { X, Trash2, Check, AlertCircle, ShoppingCart } from 'lucide-react';
import { Product } from '@/src/types';
import { calculateFinalPrice } from '@/src/utils/pricingUtils';
import { getImageUrl } from '@/src/utils/imageUtils';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemove: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  onRemove,
  onAddToCart
}) => {
  if (!isOpen) return null;

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75" onClick={onClose} aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full max-w-6xl text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl overflow-hidden my-8">
          
          <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
            <div>
                <h3 className="text-xl font-bold text-slate-800">Compare Products</h3>
                <p className="text-sm text-slate-500 mt-1">Comparing {products.length} items</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-x-auto p-6 bg-slate-50/30">
            {products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-500">No products selected for comparison.</p>
                    <button onClick={onClose} className="mt-4 text-teal-600 font-semibold hover:underline">
                        Return to Catalog
                    </button>
                </div>
            ) : (
                <div className="min-w-max">
                    <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(280px, 1fr))` }}>
                        
                        {/* Header Row: Images & Actions */}
                        <div className="p-4 font-semibold text-slate-500 text-sm flex items-center">Product</div>
                        {products.map(product => (
                            <div key={product.id} className="p-4 border-l border-slate-100 flex flex-col items-center relative group">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onRemove(product.id)}
                                        className="p-1.5 bg-white text-slate-400 hover:text-red-500 shadow-sm rounded-full border border-slate-200"
                                        title="Remove from comparison"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="h-40 w-full flex items-center justify-center mb-4 bg-white rounded-xl border border-slate-100 p-2">
                                    <img 
                                        src={getImageUrl(product.image)} 
                                        alt={product.name} 
                                        loading="lazy"
                                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/400x400/f8fafc/64748b?text=No+Image";
                                        }}
                                    />
                                </div>
                                <h4 className="font-bold text-slate-800 text-center mb-2 line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                                <button 
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-teal-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <ShoppingCart className="w-4 h-4" /> Add to Quote
                                </button>
                            </div>
                        ))}

                        {/* Price Row */}
                        <div className="p-4 font-semibold text-slate-500 text-sm bg-white border-y border-slate-100">Price</div>
                        {products.map(product => (
                            <div key={`price-${product.id}`} className="p-4 border-l border-y border-slate-100 bg-white text-center">
                                <span className="text-lg font-bold text-teal-700">
                                    ₱{calculateFinalPrice(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))}

                        {/* Category Row */}
                        <div className="p-4 font-semibold text-slate-500 text-sm">Category</div>
                        {products.map(product => (
                            <div key={`cat-${product.id}`} className="p-4 border-l border-slate-100 text-center text-slate-700 text-sm">
                                {product.category}
                            </div>
                        ))}

                        {/* Stock Status Row */}
                        <div className="p-4 font-semibold text-slate-500 text-sm bg-white border-y border-slate-100">Availability</div>
                        {products.map(product => {
                            const isOutOfStock = product.stock === 0;
                            const isLowStock = product.stock > 0 && product.stock <= 5;
                            return (
                                <div key={`stock-${product.id}`} className="p-4 border-l border-y border-slate-100 bg-white flex justify-center">
                                    {isOutOfStock ? (
                                        <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded-full">
                                            <X className="w-3 h-3" /> Out of Stock
                                        </span>
                                    ) : isLowStock ? (
                                        <span className="inline-flex items-center gap-1 text-orange-600 text-sm font-medium bg-orange-50 px-2 py-1 rounded-full">
                                            <AlertCircle className="w-3 h-3" /> Low Stock ({product.stock})
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-full">
                                            <Check className="w-3 h-3" /> In Stock
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                        {/* Description Row */}
                        <div className="p-4 font-semibold text-slate-500 text-sm">Description</div>
                        {products.map(product => (
                            <div key={`desc-${product.id}`} className="p-4 border-l border-slate-100 text-sm text-slate-600 leading-relaxed">
                                {product.description}
                            </div>
                        ))}

                        {/* ID Row */}
                        <div className="p-4 font-semibold text-slate-500 text-sm bg-white border-y border-slate-100">Product ID</div>
                        {products.map(product => (
                            <div key={`id-${product.id}`} className="p-4 border-l border-y border-slate-100 bg-white text-center text-xs font-mono text-slate-400">
                                {product.id}
                            </div>
                        ))}

                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};