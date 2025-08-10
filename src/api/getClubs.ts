// src/api/products.ts
import api from './index';
// import { ProductApiResponse, Product } from '../types/products';
import { ClubsApiResponse, Clubs } from '../types/clubs';

export const getClubs = async (): Promise<Clubs[]> => {
  try {
    const response = await api.get<ClubsApiResponse[]>('/clubs'); // localhost:3000/products

    return response.data.map((item) => ({
     id_club: item.id_club,
  name_club: item.name_club,
  logo_club: item.logo_club,
  slug: item.slug,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// export const getProductById = async (id: number): Promise<Product> => {
//   try {
//     const response = await api.get<ProductApiResponse>(`/products/${id}`);
//     const item = response.data;

//     return {
//       id: item.id_products,
//       name: item.name_products,
//       stock: item.stock,
//       price: item.prices,
//       image: item.image_products,
//       clubId: item.club_id,
//     };
//   } catch (error) {
//     console.error(`Error fetching product with ID ${id}:`, error);
//     throw error;
//   }
// };
