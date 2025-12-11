import React, { useState, useEffect, useMemo } from 'react';
import { X, ShoppingCart, Tag, Check, AlertCircle, Minus, Plus, Ruler, Barcode, Package, Link as LinkIcon } from 'lucide-react';
import { Product } from '@/types';
import { calculateFinalPrice } from '@/constants';
import { getImageUrl } from '@/utils/imageUtils';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, quantity: number, selectedVariants?: Record<string, string>, priceOverride?: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // Initialize defaults when product changes
  useEffect(() => {
    setQuantity(1);
    setShowCopyFeedback(false);
    if (product) {
        if (product.variants) {
            const defaults: Record<string, string> = {};
            product.variants.forEach(v => {
                if (v.options.length > 0) {
                    defaults[v.name] = v.options[0];
                }
            });
            setSelectedVariants(defaults);
        } else {
            setSelectedVariants({});
        }
    }
  }, [product]);

  // Derive effective price based on selected variants
  const effectivePrice = useMemo(() => {
    if (!product) return 0;
    
    let price = product.price; // Default to base product price

    // Check if any selected variant option has a specific price override
    if (product.variants) {
        product.variants.forEach(variant => {
            const selectedOption = selectedVariants[variant.name];
            // If the selected option has a price in the map, it overrides the current price
            if (selectedOption && variant.prices && variant.prices[selectedOption] !== undefined) {
                price = variant.prices[selectedOption];
            }
        });
    }
    return price;
  }, [product, selectedVariants]);

  if (!isOpen || !product) return null;

  const finalPrice = calculateFinalPrice(effectivePrice);
  const totalCost = finalPrice * quantity;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const resolvedImage = getImageUrl(product.image);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleAddToQuote = () => {
    onAddToCart(product, quantity, selectedVariants, effectivePrice);
    onClose();
  };

  const handleCopyLink = async () => {
    if (!resolvedImage) return;

    try {
      // Ensure we copy an absolute URL if the path is relative
      let urlToCopy = resolvedImage;
      if (urlToCopy.startsWith('/')) {
        urlToCopy = `${window.location.origin}${urlToCopy}`;
      }

      await navigator.clipboard.writeText(urlToCopy);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy image URL', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75 print:hidden" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Panel - Note: id="printable-product-details" to distinguish from quote */}
        <div 
          id="printable-section"
          className="inline-block w-full max-w-4xl text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl overflow-hidden relative"
        >
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-slate-600 hover:bg-white transition-all shadow-sm no-print"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
              <img 
                src={resolvedImage} 
                alt={product.name}
                loading="lazy"
                className={`max-h-[400px] w-auto object-contain mix-blend-multiply transform transition-transform duration-500 hover:scale-105 ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = "https://placehold.co/600x600/f8fafc/64748b?text=No+Image";
                  }}
              />
               {isOutOfStock ? (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md no-print">
                  Out of Stock
                </div>
              ) : isLowStock ? (
                 <div className="absolute top-6 left-6 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 no-print">
                   <AlertCircle className="w-4 h-4" />
                   Low Stock: {product.stock} left
                 </div>
              ) : (
                <div className="absolute top-6 left-6 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 no-print">
                   <Check className="w-4 h-4" />
                   In Stock
                 </div>
              )}

              {/* Copy Image Link Button */}
              <button
                onClick={handleCopyLink}
                className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-500 hover:text-teal-600 hover:bg-white transition-all shadow-md border border-slate-200 no-print flex items-center gap-2 group z-20"
                title="Copy Image URL"
              >
                 {showCopyFeedback ? (
                     <>
                       <Check className="w-4 h-4 text-emerald-500" />
                       <span className="text-xs font-bold text-emerald-600">Copied</span>
                     </>
                 ) : (
                     <>
                       <LinkIcon className="w-4 h-4" />
                       <span className="text-xs font-medium text-slate-600 group-hover:text-teal-600 hidden sm:inline">Copy Link</span>
                     </>
                 )}
              </button>
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col bg-white">
              <div className="flex-grow">
                <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3">
                  <Tag className="w-4 h-4" />
                  {product.category}
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">
                  {product.name}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {/* Stock Chip */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                      isOutOfStock ? 'bg-red-50 text-red-700 border-red-200' :
                      isLowStock ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    <Package className="w-3.5 h-3.5" />
                    {isOutOfStock ? 'Out of Stock' : `${product.stock} in Stock`}
                  </div>

                  {product.sku && (
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-mono text-slate-600 border border-slate-200">
                      <Barcode className="w-3.5 h-3.5 text-slate-400" />
                      {product.sku}
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 border border-slate-200">
                      <Ruler className="w-3.5 h-3.5 text-slate-400" />
                      {product.dimensions}
                    </div>
                  )}
                  <div className="inline-block bg-slate-50 px-2 py-1 rounded text-xs font-mono text-slate-400 border border-slate-100">
                    ID: {product.id}
                  </div>
                </div>

                <div className="prose prose-slate prose-sm text-slate-600 mb-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Description</h3>
                  <p className="text-base leading-relaxed">{product.description}</p>
                </div>

                {/* Variants Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-8 space-y-5 p-5 bg-slate-50 rounded-xl border border-slate-100">
                     {product.variants.map(variant => (
                        <div key={variant.name}>
                           <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex justify-between">
                             <span>{variant.name}</span>
                             <span className="text-slate-400 font-normal normal-case">Select one</span>
                           </label>
                           <div className="flex flex-wrap gap-2">
                              {variant.options.map(option => {
                                const isSelected = selectedVariants[variant.name] === option;
                                const optionBasePrice = variant.prices?.[option];
                                const hasPriceOverride = optionBasePrice !== undefined;
                                const optionFinalPrice = hasPriceOverride ? calculateFinalPrice(optionBasePrice) : null;
                                
                                return (
                                  <button
                                    key={option}
                                    onClick={() => handleVariantChange(variant.name, option)}
                                    className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${
                                      isSelected
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-900 ring-offset-1'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {hasPriceOverride && (
                                      <span className={`text-xs px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        ₱{optionFinalPrice?.toLocaleString()}
                                      </span>
                                    )}
                                    {isSelected && <Check className="w-3.5 h-3.5 ml-1" />}
                                  </button>
                                );
                              })}
                           </div>
                        </div>
                     ))}
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 no-print">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full sm:w-auto">
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Unit Price</p>
                     <p className="text-3xl font-black text-teal-700">
                       ₱{finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}
                     </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {!isOutOfStock && (
                      <div className="flex items-center bg-slate-100 rounded-xl h-12 px-2 border border-slate-200">
                        <button 
                          onClick={handleDecrement}
                          disabled={quantity <= 1}
                          className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-teal-600 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-bold text-slate-800 w-8 text-center">{quantity}</span>
                        <button 
                          onClick={handleIncrement}
                          disabled={quantity >= product.stock}
                          className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-teal-600 disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <button 
                      onClick={handleAddToQuote}
                      disabled={isOutOfStock}
                      className={`flex-1 sm:flex-none px-6 h-12 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                        isOutOfStock 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-900 hover:bg-teal-600 text-white hover:shadow-xl'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        Add to Quote 
                        {!isOutOfStock && (
                          <span className="ml-1 opacity-90 font-normal">
                             - ₱{totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};