export interface Variant {
  name: string;
  options: string[];
  prices?: Record<string, number>; // Map option value to specific base price
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  sku?: string;
  dimensions?: string;
  variants?: Variant[];
}

export interface CartItem extends Product {
  quantity: number;
  finalPrice: number; // Price with markup
  selectedVariants?: Record<string, string>;
}

export interface CategoryData {
  name: string;
  count: number;
}