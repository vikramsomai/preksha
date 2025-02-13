export interface Product {
  images: string[];
  name: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  sizes: string[];
  isBestseller: boolean;
}

export interface ProductSize {
  label: string;
  selected: boolean;
}
