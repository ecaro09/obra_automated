import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Plus, Check, Sparkles, Loader2, RefreshCw, Send, Barcode, Ruler, Trash2 } from 'lucide-react';
import { Product, Variant } from '../types';
import { generateProductImage, generateProductDescription } from '../services/gemini';
import { getImageUrl } from '../utils/imageUtils';

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
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [keyFeatures, setKeyFeatures] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      // Resolve URL in case it's a relative path
      setPreview(getImageUrl(productToEdit.image));
      setKeyFeatures('');
      setFileMeta(null);
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
      setPreview(null);
      setCustomPrompt('');
      setShowPromptInput(false);
      setKeyFeatures('');
      setFileMeta(null);
    }
  }, [isOpen, productToEdit]);

  // Helper to convert file to Base64 (Permanent Storage)
  const convertFileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Use Base64 instead of createObjectURL to ensure persistence across sessions
    try {
      const base64Url = await convertFileToBase64(file);
      setPreview(base64Url);
      setFormData(prev => ({ ...prev, image: base64Url }));
      setFileMeta({
        name: file.name,
        size: formatFileSize(file.size)
      });
      setShowPromptInput(false);
    } catch (err) {
      console.error("Error converting image", err);
      alert("Failed to process image file.");
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    setFileMeta(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setShowPromptInput(false);
    setCustomPrompt('');
  };

  const handleGenerateAI = async (e: React.SyntheticEvent, overridePrompt?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.name) {
      alert("Please enter a product name first to generate an image.");
      return;
    }

    setIsGenerating(true);
    try {
      // Use override prompt if provided (regeneration), otherwise default logic
      const promptToUse = overridePrompt || formData.name;
      const descriptionToUse = overridePrompt ? '' : (formData.description || '');
      const categoryToUse = formData.category || '';

      const aiImage = await generateProductImage(promptToUse, descriptionToUse, categoryToUse);
      if (aiImage) {
        setPreview(aiImage);
        setFormData(prev => ({ ...prev, image: aiImage }));
        setShowPromptInput(true); // Show input for further refinements
        setFileMeta(null); // AI generated image has no file meta
      } else {
        alert("Could not generate image. Please check your API key.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = (e: React.SyntheticEvent) => {
      // If user typed a custom prompt, use it. Otherwise rely on product name.
      const prompt = customPrompt.trim() || formData.name || '';
      handleGenerateAI(e, prompt);
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
                description: desc
                // Note: We intentionally do NOT set 'image' here. 
                // This respects the latest 'prev' state, ensuring that if a user uploaded an image 
                // while description was generating, it isn't overwritten by a stale variable.
            }));
        }
    } catch (err) {
        console.error("Desc Generation Error", err);
    } finally {
        setIsGeneratingDesc(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
        ...prev,
        variants: [...(prev.variants || []), { name: '', options: [] }]
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.id) {
        alert("Please fill in all required fields (Name, ID, Price)");
        return;
    }

    setIsSubmitting(true);
    let finalImageUrl = formData.image;

    // Only fallback to generation if ABSOLUTELY no image exists
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
      image: finalImageUrl,
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
              
              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Product Image</label>
                <div 
                  className={`relative flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
                    dragActive 
                      ? 'border-teal-500 bg-teal-50' 
                      : preview 
                        ? 'border-slate-200 bg-white' 
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />

                  {preview ? (
                    <div className="relative w-full h-full group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                        <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
                        
                        {/* File Meta Info */}
                        {fileMeta && (
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md max-w-[70%] truncate z-20 shadow-sm flex items-center gap-2 border border-white/10">
                                <span className="truncate">{fileMeta.name}</span>
                                <span className="opacity-75 border-l border-white/30 pl-2 text-[10px] font-mono">{fileMeta.size}</span>
                            </div>
                        )}
                        
                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-2 bg-white text-red-500 rounded-full shadow-md border border-slate-100 hover:bg-red-50 hover:scale-110 transition-all z-30"
                            title="Remove Image"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                Click to Change
                            </span>
                        </div>

                        {/* Regenerate UI Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 z-20 bg-white/95 border-t border-slate-200 flex gap-2 items-center backdrop-blur-sm" onClick={e => e.stopPropagation()}>
                            <input 
                                type="text"
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="Custom prompt (e.g. blue wood)"
                                className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:border-teal-500 focus:outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleRegenerate(e))}
                            />
                            <button
                              type="button"
                              onClick={(e) => handleRegenerate(e)}
                              disabled={isGenerating || isSubmitting}
                              className="bg-teal-600 hover:bg-teal-700 text-white p-1.5 rounded-md shadow-sm transition-colors disabled:opacity-50"
                              title="Regenerate Image"
                            >
                              {isGenerating ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3.5 h-3.5" />
                              )}
                            </button>
                        </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                         <Upload className="w-6 h-6 text-teal-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">Click to upload</p>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop PNG, JPG</p>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateAI(e);
                        }}
                        disabled={isGenerating || isSubmitting}
                        className="mt-4 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 mx-auto"
                      >
                         {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         Generate with AI
                      </button>
                    </div>
                  )}
                </div>
                
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
                    />
                 </div>

                 {/* Description with AI Auto-Write */}
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-semibold text-slate-700">Description</label>
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={isGeneratingDesc || !formData.name}
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
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 gap-2">
                                        <input
                                            type="text"
                                            value={variant.name}
                                            onChange={(e) => handleVariantNameChange(idx, e.target.value)}
                                            placeholder="Variant Name (e.g. Color, Size)"
                                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-teal-500 outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={variant.options.join(', ')}
                                            onChange={(e) => handleVariantOptionsChange(idx, e.target.value)}
                                            placeholder="Options (comma separated: Red, Blue)"
                                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-teal-500 outline-none"
                                        />
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