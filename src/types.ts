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
  variants?: Variant[]; // Added variants property
  seller_id?: string; // Added seller_id for Supabase integration
  created_at?: string;
  updated_at?: string;
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