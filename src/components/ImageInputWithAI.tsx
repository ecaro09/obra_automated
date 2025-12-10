import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, Loader2, RefreshCw, Link, Trash2 } from 'lucide-react';
import { generateProductImage } from '../services/gemini';
import { getImageUrl } from '../utils/imageUtils';

interface ImageInputWithAIProps {
  value: string; // Current image URL (can be base64, external URL, or AI generated)
  onImageChange: (newImageUrl: string) => void;
  productName: string;
  productDescription: string;
  productCategory: string;
  disabled: boolean; // To disable interactions during form submission
}

export const ImageInputWithAI: React.FC<ImageInputWithAIProps> = ({
  value,
  onImageChange,
  productName,
  productDescription,
  productCategory,
  disabled
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      const imgUrl = getImageUrl(value);
      setPreview(imgUrl);
      // If it's a URL (not base64 data), populate the input box
      if (!value.startsWith('data:')) {
        setImageUrlInput(value);
      } else {
        setImageUrlInput('');
      }
      setFileMeta(null); // Clear file meta if image is from URL or AI
    } else {
      setPreview(null);
      setImageUrlInput('');
      setFileMeta(null);
    }
    setCustomPrompt(''); // Reset custom prompt on value change
  }, [value]);

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
    try {
      const base64Url = await convertFileToBase64(file);
      onImageChange(base64Url);
      setFileMeta({
        name: file.name,
        size: formatFileSize(file.size)
      });
      setImageUrlInput(''); // Clear URL input if file is selected
    } catch (err) {
      console.error("Error converting image", err);
      alert("Failed to process image file.");
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange('');
    setFileMeta(null);
    setImageUrlInput('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setCustomPrompt('');
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(e.target.value);
  };

  const handleUrlInputBlur = () => {
    if (imageUrlInput.trim() !== '') {
        const url = getImageUrl(imageUrlInput.trim());
        onImageChange(imageUrlInput.trim()); // Pass the raw URL to parent
        setFileMeta(null);
    }
  };

  const handleGenerateAI = async (e: React.SyntheticEvent, overridePrompt?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productName) {
      alert("Please enter a product name first to generate an image.");
      return;
    }

    setIsGenerating(true);
    try {
      const promptToUse = overridePrompt || productName;
      const descriptionToUse = overridePrompt ? '' : (productDescription || '');
      const categoryToUse = productCategory || '';

      const aiImage = await generateProductImage(promptToUse, descriptionToUse, categoryToUse);
      if (aiImage) {
        onImageChange(aiImage);
        setImageUrlInput(''); // Clear URL input
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
      const prompt = customPrompt.trim() || productName || '';
      handleGenerateAI(e, prompt);
  };

  return (
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
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
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
                  disabled={disabled}
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
                      disabled={disabled || isGenerating}
                  />
                  <button
                    type="button"
                    onClick={(e) => handleRegenerate(e)}
                    disabled={isGenerating || disabled}
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
              disabled={isGenerating || disabled || !productName}
              className="mt-4 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 mx-auto"
            >
               {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
               Generate with AI
            </button>
          </div>
        )}
      </div>

      {/* Paste URL Section - Always Visible */}
      <div className="pt-3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
              Image URL
          </label>
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-4 w-4 text-slate-400" />
              </div>
              <input
                  type="text"
                  className="block w-full pl-10 pr-16 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrlInput}
                  onChange={handleUrlInputChange}
                  onBlur={handleUrlInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlInputBlur())}
                  disabled={disabled}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button 
                      type="button"
                      onClick={handleUrlInputBlur}
                      className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500 hover:text-teal-600 hover:border-teal-500 transition-colors"
                      disabled={disabled}
                  >
                      Apply
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};