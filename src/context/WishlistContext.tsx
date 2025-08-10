// src/context/WishlistContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/src/types/products'; // Kita akan gunakan tipe data Product yang sudah ada

// Tipe untuk nilai yang akan disediakan oleh Context
interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
}

// Membuat Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Hook kustom untuk menggunakan WishlistContext
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Props untuk Provider
interface WishlistProviderProps {
  children: ReactNode;
}

// Komponen Provider
export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Fungsi untuk menambah produk ke wishlist
  const addToWishlist = (product: Product) => {
    setWishlistItems((prevItems) => {
      // Cek agar tidak ada duplikat
      if (prevItems.find((item) => item.id === product.id)) {
        return prevItems;
      }
      return [...prevItems, product];
    });
  };

  // Fungsi untuk menghapus produk dari wishlist
  const removeFromWishlist = (productId: number) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Fungsi untuk mengecek apakah sebuah produk sudah ada di wishlist
  const isWishlisted = (productId: number) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};