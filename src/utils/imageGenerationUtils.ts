export const getPlaceholderImgUrl = (id: string, category: string, name: string): string => {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const prompt = `professional product photography of ${name}, ${category}, white background, soft studio lighting, modern furniture design, high resolution, 4k, minimalistic`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true&seed=${seed}`;
};