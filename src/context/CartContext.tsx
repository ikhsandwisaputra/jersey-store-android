// src/context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Tipe untuk setiap item dalam keranjang
export interface CartItem {
  id_products: number;
  name_products: string;
  prices: number;
  image_products: string;
  stock: number;
  quantity: number; // Menambahkan quantity untuk setiap item
}

// Tipe untuk nilai yang akan disediakan oleh Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

// Membuat Context dengan nilai default undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook kustom untuk menggunakan CartContext dengan mudah
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Props untuk Provider, termasuk 'children'
interface CartProviderProps {
  children: ReactNode;
}

// Komponen Provider yang akan membungkus aplikasi kita
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Menghitung ulang total harga setiap kali cartItems berubah
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.prices * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // Fungsi untuk menambah produk ke keranjang
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id_products === product.id_products);

      if (existingItem) {
        // Jika item sudah ada, tambah quantity-nya
        return prevItems.map((item) =>
          item.id_products === product.id_products
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Jika item baru, tambahkan ke keranjang dengan quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Fungsi untuk mengubah jumlah item
  const updateQuantity = (productId: number, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id_products === productId) {
          // Jika kuantitas baru 0 atau kurang, hapus item
          if (newQuantity <= 0) {
            return null;
          }
          // Batasi kuantitas dengan stok yang tersedia
          const quantity = Math.min(newQuantity, item.stock);
          return { ...item, quantity };
        }
        return item;
      }).filter((item): item is CartItem => item !== null) // Hapus item yang null
    );
  };
  
  // Fungsi untuk menghapus item dari keranjang
  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id_products !== productId));
  };
  
  // Fungsi untuk mengosongkan keranjang
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};