// src/types/products.ts
export interface ProductApiResponse {
  id_products: number;
  name_products: string;
  stock: number;
  prices: number;
  image_products: string;
  club_id: number;
}

export interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  image: string;
  clubId: number;
}
