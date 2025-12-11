export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '';
  
  // Check if it's already a full URL or Data URI
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Get base URL from meta tag
  const baseUrlMeta = document.querySelector('meta[name="image-base-url"]');
  const baseUrl = baseUrlMeta ? baseUrlMeta.getAttribute('content') || '' : '';
  
  // Handle relative paths
  if (imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // Add slash if missing and baseUrl doesn't have it
  const separator = baseUrl.endsWith('/') ? '' : '/';
  return `${baseUrl}${separator}${imagePath}`;
};