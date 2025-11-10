export interface Category {
  name: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface CustomizationOptions {
  sizes?: string[];
  colors?: string[]; // Array of hex color strings
  allowQuantity?: boolean;
}

export interface Product {
  id: string; // Add ID for unique identification
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  reviews: Review[];
  price?: string;
  customization?: CustomizationOptions;
}

export interface CartItem {
  id: string; // Unique ID for the cart item, e.g., `${product.id}-${size}-${color}`
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
