import React, { useState, useEffect } from 'react';
import { Image, Sparkles, Loader2, Edit, X } from 'lucide-react';
import { generateProductImage } from '@/services/gemini';
import { getImageUrl } from '@/utils/imageUtils';

interface ImageInputWithAIProps {
  value: string;
  onImageChange: (newImageUrl: string) => void;
  productName: string;
  productDescription: string;
  productCategory: string;
  disabled?: boolean;
}

export const ImageInputWithAI: React.FC<ImageInputWithAIProps> = ({
  value,
  onImageChange,
  productName,
  productDescription,
  productCategory,
  disabled = false,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [manualUrl, setManualUrl] = useState<string>('');

  // Generate a consistent text-based placeholder URL
  const getPlaceholderUrl = (name: string) => {
    return `https://placehold.co/600x400/f1f5f9/475569?text=${encodeURIComponent(name.replace(/\s+/g, '+'))}`;
  };

  useEffect(() => {
    if (value) {
      setImgSrc(getImageUrl(value));
      setManualUrl(value);
    } else {
      setImgSrc(getPlaceholderUrl(productName || 'Product Image'));
      setManualUrl('');
    }
    setIsImageLoading(true); // Always show loading when image source changes
  }, [value, productName]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    // If the current image fails to load, fall back to a placeholder
    setImgSrc(getPlaceholderUrl(productName || 'Product Image'));
    setIsImageLoading(false);
  };

  const handleGenerateImage = async () => {
    if (!productName || disabled) return;

    setIsGeneratingImage(true);
    setIsImageLoading(true); // Show shimmer while generating
    setShowUrlInput(false); // Hide URL input if visible

    try {
      const generatedUrl = await generateProductImage(
        productName,
        productDescription,
        productCategory
      );

      if (generatedUrl) {
        onImageChange(generatedUrl);
        setImgSrc(generatedUrl); // Update local state for immediate display
      } else {
        // If AI generation fails, revert to placeholder and show error implicitly
        onImageChange(''); // Clear image in parent state
        setImgSrc(getPlaceholderUrl(productName || 'Product Image'));
        console.error("Failed to generate image after retries.");
      }
    } catch (error) {
      console.error("Error during AI image generation:", error);
      onImageChange(''); // Clear image in parent state
      setImgSrc(getPlaceholderUrl(productName || 'Product Image'));
    } finally {
      setIsGeneratingImage(false);
      // isImageLoading will be set to false by handleImageLoad or handleImageError
    }
  };

  const handleManualUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualUrl(e.target.value);
  };

  const handleSaveManualUrl = () => {
    if (manualUrl.trim()) {
      // Validate image before updating state or persistence
      setIsImageLoading(true);
      const tempImg = new Image();
      tempImg.onload = () => {
        onImageChange(manualUrl.trim());
        setShowUrlInput(false);
        // isImageLoading will be set to false by handleImageLoad
      };
      tempImg.onerror = () => {
        setIsImageLoading(false);
        alert("Error: The provided URL could not be loaded. Please check the URL.");
        // Do not update state or persist, effectively reverting
      };
      tempImg.src = getImageUrl(manualUrl.trim());
    } else {
      onImageChange(''); // Clear image if URL is empty
      setShowUrlInput(false);
    }
  };

  const handleCancelManualUrl = () => {
    setShowUrlInput(false);
    setManualUrl(value); // Revert to current value
  };

  return (
    <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 shadow-sm">
      {isImageLoading && (isGeneratingImage || !imgSrc.startsWith('data:image')) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 bg-opacity-75 z-10">
          <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
        </div>
      )}

      <img
        src={imgSrc}
        alt={productName || "Product Image"}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      <div className="absolute bottom-3 right-3 flex gap-2 z-20">
        <button
          type="button"
          onClick={() => setShowUrlInput(true)}
          className="p-2 bg-white rounded-full shadow-md text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Edit Image URL"
          disabled={disabled || isGeneratingImage}
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleGenerateImage}
          className="p-2 bg-slate-900 rounded-full shadow-md text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
          title="Generate Image with AI"
          disabled={disabled || isGeneratingImage || !productName}
        >
          {isGeneratingImage ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </button>
      </div>

      {showUrlInput && (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center p-4 z-30">
          <h4 className="text-lg font-semibold text-slate-800 mb-3">Enter Image URL</h4>
          <input
            type="text"
            value={manualUrl}
            onChange={handleManualUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full max-w-sm px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none mb-4"
            disabled={disabled || isGeneratingImage}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancelManualUrl}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
              disabled={disabled || isGeneratingImage}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveManualUrl}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
              disabled={disabled || isGeneratingImage}
            >
              Save URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};