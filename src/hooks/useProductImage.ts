import React, { useState, useEffect } from 'react';
import { Product } from '@/src/types';
import { generateProductImage } from '@/src/services/gemini';
import { getImageUrl } from '@/src/utils/imageUtils';

export const useProductImage = (
  product: Product,
  onUpdateImageInState: (id: string, newUrl: string) => void // New prop for centralized update
) => {
  const [imgSrc, setImgSrc] = useState<string>(getImageUrl(product.image));
  const [isPlaceholder, setIsPlaceholder] = useState<boolean>(false);
  const [hasFinalError, setHasFinalError] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [triedAIFallback, setTriedAIFallback] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  // Generate a consistent text-based placeholder URL
  const getPlaceholderUrl = (name: string) => {
    return `https://placehold.co/400x400/f8fafc/64748b?text=${encodeURIComponent(name)}`;
  };

  useEffect(() => {
    // Reset state when product changes
    if (product.image) {
      const resolvedUrl = getImageUrl(product.image);
      setImgSrc(resolvedUrl);
      // Check if the loaded image is a placeholder
      setIsPlaceholder(resolvedUrl.includes('placehold.co'));
      setHasFinalError(false);
      setTriedAIFallback(false);
    } else {
      // If no initial image, jump straight to placeholder
      setImgSrc(getPlaceholderUrl(product.name));
      setIsPlaceholder(true);
      setHasFinalError(false);
      setTriedAIFallback(false);
    }
  }, [product]);

  // Handle loading state when source changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [imgSrc]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImgError = async () => {
    if (!isPlaceholder) {
      // 1. If the main image fails, switch to placeholder first
      setImgSrc(getPlaceholderUrl(product.name));
      setIsPlaceholder(true);
    } else if (!triedAIFallback) {
      // 2. If placeholder also fails, try AI generation automatically
      setTriedAIFallback(true);
      setIsGenerating(true);
      setIsImageLoading(true); // Show shimmer immediately during auto-recovery
      
      try {
        // Pass full context (Category + Description) for better auto-recovery results
        const generatedUrl = await generateProductImage(
            product.name, 
            product.description, 
            product.category
        );

        if (generatedUrl) {
          setImgSrc(generatedUrl);
          setIsPlaceholder(false); // It's a real image now
          setHasFinalError(false);
          // Persist the auto-generated image using the centralized function
          onUpdateImageInState(product.id, generatedUrl);
        } else {
          setHasFinalError(true);
          setIsImageLoading(false); // Stop loading since we have no image to show
        }
      } catch (err) {
        console.error("AI Auto-generation failed:", err);
        setHasFinalError(true);
        setIsImageLoading(false); // Stop loading on error
      } finally {
        setIsGenerating(false);
      }
    } else {
      // 3. If AI also fails or was already tried, show the error state
      setHasFinalError(true);
      setIsImageLoading(false); // Stop loading since we have no image to show
    }
  };

  const handleGenerateImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    setIsImageLoading(true); // Show shimmer immediately to hide old image
    
    // Explicitly pass category and description to ensure high-quality context-aware generation
    const generatedUrl = await generateProductImage(
        product.name, 
        product.description, 
        product.category
    );
    
    if (generatedUrl) {
      setImgSrc(generatedUrl);
      setIsPlaceholder(false);
      setHasFinalError(false);
      // Persist the generated image using the centralized function
      onUpdateImageInState(product.id, generatedUrl);
    } else {
        console.error("Failed to generate image");
        setIsImageLoading(false); // Ensure loading stops if generation failed
    }
    
    setIsGenerating(false);
  };

  const handleEditImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newUrl = window.prompt("Enter new image URL:", imgSrc);
    
    if (newUrl && newUrl.trim() !== "") {
        const resolvedUrl = getImageUrl(newUrl);
        
        // Show loading state while validating
        setIsImageLoading(true);

        // Validate image before updating state or persistence
        const tempImg = new Image();
        tempImg.onload = () => {
            setImgSrc(resolvedUrl);
            setIsPlaceholder(false);
            setHasFinalError(false);
            setTriedAIFallback(true);
            setIsImageLoading(false);
            // Persist only valid images using the centralized function
            onUpdateImageInState(product.id, resolvedUrl);
        };

        tempImg.onerror = () => {
            setIsImageLoading(false);
            alert("Error: The provided URL could not be loaded. Reverting to the previous image.");
            // Do not update state or persist, effectively reverting
        };

        tempImg.src = resolvedUrl;
    }
  };

  return {
    imgSrc,
    isPlaceholder,
    hasFinalError,
    isGenerating,
    isImageLoading,
    handleImgError,
    handleGenerateImage,
    handleEditImage,
    handleImageLoad
  };
};