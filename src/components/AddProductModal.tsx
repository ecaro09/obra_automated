import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Sparkles, Loader2, Barcode, Ruler, Send } from 'lucide-react';
import { Product, Variant } from '@/src/types';
import { generateProductDescription, generateProductImage } from '@/src/services/gemini'; // Ensure generateProductImage is imported for fallback
import { ImageInputWithAI } from '@/src/components/ImageInputWithAI';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
}

const CATEGORIES = [
  "Office Table",
  "Office Chair",
  "Cabinet & Storage",
  "Reception & Conference",
  "Home Furniture",
  "Workstation",
  "Executive Table",
  "Accessories"
];

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyFeatures, setKeyFeatures] = useState('');
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    id: '',
    category: 'Office Table',
    price: 0,
    stock: 1,
    description: '',
    image: '',
    sku: '',
    dimensions: '',
    variants: []
  });

  // Populate form when editing
  useEffect(() => {
    if (isOpen && productToEdit) {
      setFormData({ 
          ...productToEdit,
          variants: productToEdit.variants || [] 
      });
      setKeyFeatures('');
    } else if (isOpen && !productToEdit) {
      // Reset if opening in add mode
      setFormData({
        name: '',
        id: '',
        category: 'Office Table',
        price: 0,
        stock: 1,
        description: '',
        image: '',
        sku: '',
        dimensions: '',
        variants: []
      });
      setKeyFeatures('');
    }
  }, [isOpen, productToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = (newImageUrl: string) => {
    setFormData(prev => ({ ...prev, image: newImageUrl }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) return;
    setIsGeneratingDesc(true);
    
    try {
        const desc = await generateProductDescription(
            formData.name, 
            formData.category || 'Furniture', 
            keyFeatures // Pass explicit key features instead of existing description
        );
        
        if (desc) {
            setFormData(prev => ({ 
                ...prev, 
                description: desc,
            }));
        }
    } catch (err) {
        console.error("Desc Generation Error", err);
    } finally {
        setIsGeneratingDesc(false);
    }
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
        ...prev,
        variants: [...(prev.variants || []), { name: '', options: [], prices: {} }]
    }));
  };

  const handleRemoveVariant = (index: number) => {
      setFormData(prev => {
          const newVariants = [...(prev.variants || [])];
          newVariants.splice(index, 1);
          return { ...prev, variants: newVariants };
      });
  };

  const handleVariantNameChange = (index: number, name: string) => {
      setFormData(prev => {
          const newVariants = [...(prev.variants || [])];
          newVariants[index] = { ...newVariants[index], name };
          return { ...prev, variants: newVariants };
      });
  };

  const handleVariantOptionsChange = (index: number, optionsString: string) => {
      // Convert comma-separated string to array
      const options = optionsString.split(',').map(s => s.trim()).filter(Boolean);
      setFormData(prev => {
          const newVariants = [...(prev.variants || [])];
          newVariants[index] = { ...newVariants[index], options };
          return { ...prev, variants: newVariants };
      });
  };

  const handleVariantPriceChange = (variantIndex: number, option: string, price: string) => {
      setFormData(prev => {
          const newVariants = [...(prev.variants || [])];
          const currentVariant = newVariants[variantIndex];
          const currentPrices = { ...(currentVariant.prices || {}) };

          if (price && price.trim() !== '') {
              currentPrices[option] = parseFloat(price);
          } else {
              delete currentPrices[option];
          }

          newVariants[variantIndex] = { ...currentVariant, prices: currentPrices };
          return { ...prev, variants: newVariants };
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.id) {
        alert("Please fill in all required fields (Name, ID, Price)");
        return;
    }

    setIsSubmitting(true);
    let finalImageUrl = formData.image;

    // Only fallback to AI generation if ABSOLUTELY no image exists
    if (!finalImageUrl) {
        try {
            const generatedUrl = await generateProductImage(
                formData.name, 
                formData.description || `A ${formData.category}`,
                formData.category || ''
            );
            
            if (generatedUrl) {
                finalImageUrl = generatedUrl;
            } else {
                finalImageUrl = `https://placehold.co/600x400/f1f5f9/475569?text=${encodeURIComponent(formData.name.replace(/\s+/g, '+'))}`;
            }
        } catch (error) {
            console.error("Error generating image on submit:", error);
            finalImageUrl = `https://placehold.co/600x400/f1f5f9/475569?text=${encodeURIComponent(formData.name.replace(/\s+/g, '+'))}`;
        }
    }

    const productData: Product = {
      id: formData.id || Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Untitled Product',
      description: formData.description || '',
      category: formData.category || 'Uncategorized',
      price: formData.price || 0,
      stock: formData.stock || 0,
      image: finalImageUrl || '',
      sku: formData.sku,
      dimensions: formData.dimensions,
      variants: formData.variants
    };

    onSave(productData);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75" onClick={onClose} aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full max-w-2xl text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Image Input Section (now a component) */}
              <div>
                <ImageInputWithAI
                  value={formData.image || ''}
                  onImageChange={handleImageChange}
                  productName={formData.name || ''}
                  productDescription={formData.description || ''}
                  productCategory={formData.category || ''}
                  disabled={isSubmitting}
                />
                
                <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Product ID (Unique)</label>
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="e.g. TBL-001"
                        required
                        disabled={isSubmitting || !!productToEdit} 
                    />
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                 {/* Name */}
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="Executive Desk..."
                        required
                        disabled={isSubmitting}
                    />
                 </div>

                 {/* Category & Stock Row */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                            disabled={isSubmitting}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            min="0"
                            disabled={isSubmitting}
                        />
                    </div>
                 </div>

                 {/* Price */}
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Base Price (₱)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                        min="0"
                        step="0.01"
                        required
                        disabled={isSubmitting}
                    />
                 </div>

                 {/* Key Features for AI */}
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Key Features <span className="text-slate-400 font-normal normal-case">(Optional, for AI context)</span>
                    </label>
                    <input
                        type="text"
                        value={keyFeatures}
                        onChange={(e) => setKeyFeatures(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="e.g. Ergonomic, Water-resistant, 5-year warranty"
                        disabled={isSubmitting}
                    />
                 </div>

                 {/* Description with AI Auto-Write */}
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-semibold text-slate-700">Description</label>
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={isGeneratingDesc || !formData.name || isSubmitting}
                            className="text-xs flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            Auto-Write
                        </button>
                    </div>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                        placeholder="Detailed product description..."
                        disabled={isSubmitting}
                    />
                 </div>

                 {/* SKU & Dimensions */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">SKU (Optional)</label>
                        <div className="relative">
                            <Barcode className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="Code"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Dimensions</label>
                        <div className="relative">
                            <Ruler className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                name="dimensions"
                                value={formData.dimensions}
                                onChange={handleInputChange}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="L x W x H"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                 </div>

                 {/* Variants */}
                 <div className="pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Variants</label>
                        <button
                            type="button"
                            onClick={handleAddVariant}
                            className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors"
                            disabled={isSubmitting}
                        >
                            <Plus className="w-3 h-3" /> Add
                        </button>
                    </div>
                    
                    {formData.variants && formData.variants.length > 0 ? (
                        <div className="space-y-3">
                            {formData.variants.map((variant, idx) => (
                                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative group">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVariant(idx)}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 gap-2">
                                        <input
                                            type="text"
                                            value={variant.name}
                                            onChange={(e) => handleVariantNameChange(idx, e.target.value)}
                                            placeholder="Variant Name (e.g. Size)"
                                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-teal-500 outline-none"
                                            disabled={isSubmitting}
                                        />
                                        <input
                                            type="text"
                                            value={variant.options.join(', ')}
                                            onChange={(e) => handleVariantOptionsChange(idx, e.target.value)}
                                            placeholder="Options (e.g. 1.2m, 1.4m)"
                                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-teal-500 outline-none"
                                            disabled={isSubmitting}
                                        />
                                        
                                        {/* Price Overrides per Option */}
                                        {variant.options.length > 0 && (
                                            <div className="mt-2 space-y-2 pl-2 border-l-2 border-slate-100">
                                                {variant.options.map((option) => (
                                                    <div key={option} className="flex items-center gap-2 text-sm">
                                                        <span className="flex-1 text-slate-600 truncate" title={option}>{option}</span>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-slate-400 text-xs">₱</span>
                                                            <input
                                                                type="number"
                                                                placeholder="Override Price"
                                                                value={variant.prices?.[option] || ''}
                                                                onChange={(e) => handleVariantPriceChange(idx, option, e.target.value)}
                                                                className="w-24 px-2 py-1 text-xs border border-slate-200 rounded focus:border-teal-500 outline-none"
                                                                disabled={isSubmitting}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No variants added.</p>
                    )}
                 </div>

              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-teal-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center gap-2"
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {productToEdit ? 'Save Changes' : 'Add Product'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};