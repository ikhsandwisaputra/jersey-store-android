// src/api/products.ts
import api from './index';
import { ProductApiResponse, Product } from '../types/products';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ProductApiResponse[]>('/products'); // localhost:3000/products

    return response.data.map((item) => ({
      id: item.id_products,
      name: item.name_products,
      stock: item.stock,
      price: item.prices,
      image: item.image_products,
      clubId: item.club_id,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<ProductApiResponse>(`/products/${id}`);
    const item = response.data;

    return {
      id: item.id_products,
      name: item.name_products,
      stock: item.stock,
      price: item.prices,
      image: item.image_products,
      clubId: item.club_id,
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};
