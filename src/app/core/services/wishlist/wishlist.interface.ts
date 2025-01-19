export interface IWishlistList {
  name: string;
  price: string;
  sizes: string[];
  colors: Color[];
  id: number; // Assuming each product has a unique ID
}

export interface Color {
  name: string;
  image: string;
  hoverImage: string;
}
