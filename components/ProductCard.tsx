import React, { useState } from 'react';
import { Plus, Tag, AlertCircle, Minus, Image as ImageIcon, Sparkles, Loader2, Scale, Pencil, Link, ImageOff, CheckCircle2, XCircle, FileEdit, Check, Ruler, Layers } from 'lucide-react';
import { Product } from '../types';
import { calculateFinalPrice } from '../constants';
import { useProductImage } from '../hooks/useProductImage';

export type BatchStatus = 'idle' | 'generating' | 'success' | 'error';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
  onClick?: (product: Product) => void;
  onCompare?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onUpdateImageInState: (id: string, newUrl: string) => void; // Changed prop name
  isComparing?: boolean;
  // Batch Props
  isBatchMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  batchStatus?: BatchStatus;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAdd, 
  onClick,
  onCompare,
  onEdit,
  onUpdateImageInState, // Destructure the new prop
  isComparing = false,
  isBatchMode = false,
  isSelected = false,
  onToggleSelect,
  batchStatus = 'idle'
}) => {
  const [quantity, setQuantity] = useState(1);
  
  // Use custom hook for image logic, passing the new update function
  const {
    imgSrc,
    isPlaceholder,
    hasFinalError,
    isGenerating,
    isImageLoading,
    handleImgError,
    handleGenerateImage,
    handleEditImage,
    handleImageLoad
  } = useProductImage(product, onUpdateImageInState); // Pass the new prop here
  
  const finalPrice = calculateFinalPrice(product.price);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const variantCount = product.variants ? product.variants.length : 0;

  const handleEditProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use product.image (the source of truth) if available, otherwise fallback to imgSrc.
    // This prevents overwriting a valid (but temporarily failing) URL with a placeholder.
    if (onEdit) onEdit({ ...product, image: product.image || imgSrc });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use the current imgSrc from hook for visual consistency in cart
    if (variantCount > 0 && onClick) {
      onClick({ ...product, image: imgSrc });
    } else {
      onAdd({ ...product, image: imgSrc }, quantity);
      setQuantity(1); 
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use the current imgSrc from hook
    if (onCompare) onCompare({ ...product, image: imgSrc });
  };

  const handleCardClick = () => {
    if (isBatchMode && onToggleSelect) {
      onToggleSelect(product.id);
    } else if (onClick) {
      // Use the current imgSrc from hook
      onClick({ ...product, image: imgSrc });
    }
  };

  const isMissingImage = isPlaceholder || hasFinalError;

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer relative
        ${isOutOfStock ? 'opacity-75' : ''} 
        ${isComparing ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-100'}
        ${isBatchMode && isSelected ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/10' : ''}
        ${isBatchMode && isMissingImage && !isSelected ? 'ring-2 ring-orange-300 border-orange-300 bg-orange-50/10' : ''}
        ${!isBatchMode ? 'hover:shadow-lg' : ''}
      `}
    >
      {/* Batch Selection Overlay */}
      {isBatchMode && (
        <div className="absolute top-3 left-3 z-50">
          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors shadow-sm ${
            isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-slate-300'
          }`}>
            {isSelected && <Check className="w-4 h-4" />}
          </div>
        </div>
      )}

      {/* Batch Status Overlays */}
      {batchStatus === 'generating' && (
        <div className="absolute inset-0 z-40 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-teal-600 animate-in fade-in duration-300">
          <Loader2 className="w-10 h-10 animate-spin mb-2" />
          <span className="font-bold text-sm">Generating...</span>
        </div>
      )}
      {batchStatus === 'success' && (
        <div className="absolute inset-0 z-40 bg-emerald-50/90 backdrop-blur-[1px] flex flex-col items-center justify-center text-emerald-600 animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="w-12 h-12 mb-2" />
          <span className="font-bold text-lg">Image Updated</span>
        </div>
      )}
      {batchStatus === 'error' && (
        <div className="absolute inset-0 z-40 bg-red-50/90 backdrop-blur-[1px] flex flex-col items-center justify-center text-red-600 animate-in zoom-in-95 duration-300">
          <XCircle className="w-12 h-12 mb-2" />
          <span className="font-bold text-lg">Generation Failed</span>
        </div>
      )}

      <div className="relative h-48 bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
        
        {/* Unified Loading/Generating State with Shimmer */}
        {(isImageLoading || isGenerating) && !hasFinalError && !isBatchMode && (
             <div className="absolute inset-0 shimmer-effect flex items-center justify-center z-20">
                {!isGenerating && (
                    <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm border border-white/20">
                        <ImageIcon className="w-5 h-5 text-slate-400/70" />
                    </div>
                )}
             </div>
        )}

        {/* AI Generating Overlay (Sits on top of shimmer) */}
        {isGenerating && !isBatchMode && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[1px]">
                 <div className="bg-white/95 px-4 py-3 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-600 mb-2" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Generating</span>
                </div>
            </div>
        )}

        {/* 3. The Image or Fallback */}
        {!hasFinalError ? (
          <>
            <img 
              src={imgSrc} 
              alt={product.name}
              className={`h-full w-full transform transition-all duration-500 ease-in-out group-hover:scale-105 ${
                isPlaceholder ? 'object-cover' : 'object-contain mix-blend-multiply'
              } ${isOutOfStock ? 'grayscale' : ''} 
              ${isImageLoading ? 'opacity-0' : 'opacity-100'} 
              `}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImgError}
            />
            {/* Update Controls (Only visible on hover if loaded) */}
            {isPlaceholder && !isGenerating && !isBatchMode && !isImageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 hover:bg-slate-900/30 transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-[1px]">
                    <div className="flex gap-2">
                        <button
                            onClick={handleGenerateImage}
                            className="bg-white p-2 rounded-full shadow-lg text-teal-600 hover:text-teal-700 hover:scale-110 transition-all flex flex-col items-center justify-center gap-1 min-w-[3rem]"
                            title="Generate AI Image"
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleEditImage}
                            className="bg-white p-2 rounded-full shadow-lg text-slate-500 hover:text-slate-700 hover:scale-110 transition-all flex flex-col items-center justify-center gap-1 min-w-[3rem]"
                            title="Edit Image URL"
                        >
                            <Pencil className="w-5 h-5" />
                        </button>
                    </div>
                    <span className="mt-2 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Update Image
                    </span>
                </div>
            )}
          </>
        ) : (
          /* Error State */
          <div className="flex flex-col items-center justify-center text-slate-400 w-full h-full bg-slate-50 relative group/error px-4 text-center">
            <div className="mb-2 p-3 bg-white rounded-full shadow-sm">
                <ImageOff className="w-6 h-6 opacity-50" />
            </div>
            <span className="text-xs font-medium text-slate-500 mb-3">Image Unavailable</span>
            
            {!isGenerating && !isBatchMode && (
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={handleGenerateImage}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-teal-500 hover:text-teal-600 transition-colors text-xs font-bold text-slate-600"
                        title="Retry AI Generation"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Retry AI
                    </button>
                    
                    <button
                        onClick={handleEditImage}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-400 hover:text-slate-800 transition-colors text-xs font-bold text-slate-600"
                        title="Manually Add URL"
                    >
                        <Link className="w-3.5 h-3.5" />
                        Add URL
                    </button>
                </div>
            )}
          </div>
        )}
        
        {/* Quick Edit Buttons - Visible on Hover when image exists and not in special modes */}
        {!hasFinalError && !isPlaceholder && !isBatchMode && !isImageLoading && (
            <div className="absolute top-3 left-3 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover:translate-x-0">
                <button
                    onClick={handleGenerateImage}
                    className="bg-white/90 hover:bg-white text-teal-600 hover:text-teal-700 p-1.5 rounded-full shadow-sm border border-slate-100"
                    title="Regenerate with AI"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={handleEditImage}
                    className="bg-white/90 hover:bg-white text-slate-500 hover:text-slate-700 p-1.5 rounded-full shadow-sm border border-slate-100"
                    title="Edit Image URL"
                >
                    <Pencil className="w-3.5 h-3.5" />
                </button>
            </div>
        )}

        {/* Categories (Shifted right in batch mode to avoid checkbox overlap) */}
        <div className={`absolute top-3 ${isBatchMode ? 'left-10' : 'left-12'} bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-1 z-20 pointer-events-none transition-opacity ${!hasFinalError && !isBatchMode ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'}`}>
          <Tag className="w-3 h-3" />
          {product.category}
        </div>
        
        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none flex flex-col gap-1 items-end">
          {isOutOfStock ? (
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
              Out of Stock
            </span>
          ) : isLowStock ? (
             <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
               <AlertCircle className="w-3 h-3" />
               Only {product.stock} left
             </span>
          ) : null}

          {variantCount > 0 && (
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {variantCount} Variants
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-bold text-slate-800 mb-0.5 line-clamp-2 min-h-[3rem] group-hover:text-teal-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
             {product.sku && (
                <div className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200" title="SKU">
                    {product.sku}
                </div>
             )}
             {product.dimensions && (
                 <div className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1" title="Dimensions">
                    <Ruler className="w-3 h-3" />
                    {product.dimensions}
                 </div>
             )}
          </div>
          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>
        
        {!isBatchMode && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Price</span>
              <span className="text-lg font-bold text-teal-700">
                ₱{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                  onClick={handleEditProduct}
                  className="rounded-lg w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
                  title="Edit Product"
              >
                  <FileEdit className="w-5 h-5" />
              </button>

              <button
                  onClick={handleCompare}
                  className={`rounded-lg w-10 h-10 flex items-center justify-center transition-all duration-200 ${
                      isComparing 
                      ? 'bg-indigo-100 text-indigo-600 shadow-inner' 
                      : 'text-slate-400 hover:bg-slate-100 hover:text-indigo-600'
                  }`}
                  title={isComparing ? "Remove from comparison" : "Add to comparison"}
              >
                  <Scale className="w-5 h-5" />
              </button>

              {!isOutOfStock && variantCount === 0 && (
                <div className="flex items-center bg-slate-100 rounded-lg h-10 px-1">
                  <button 
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="w-7 h-full flex items-center justify-center text-slate-500 hover:text-teal-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold text-slate-700 w-6 text-center select-none">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="w-7 h-full flex items-center justify-center text-slate-500 hover:text-teal-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}

              <button 
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`rounded-full w-10 h-10 flex items-center justify-center shadow-md transform transition-all duration-200 ${
                  isOutOfStock 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900 hover:bg-teal-600 text-white active:scale-90'
                }`}
                title={isOutOfStock ? "Out of Stock" : (variantCount > 0 ? "Select Options" : `Add ${quantity} to Quote`)}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;