// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
// Anda perlu membuat file api/auth.ts ini nanti
// Jangan lupa import getProfile
import { login as apiLogin, getProfile } from '../api/auth';
// Tipe untuk data user yang kita simpan di state
interface User {
  id: number;
  name: string;
  email: string;
}
// import { User } from '../types/users';
// Tipe untuk nilai yang akan disediakan oleh AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean; // Untuk menunjukkan proses pengecekan token awal
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
    updateUser: (newUserData: User) => void;
}

// Kunci untuk menyimpan token di SecureStore
const TOKEN_KEY = 'my-jwt';

// Membuat Context dengan nilai default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Membuat Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fungsi ini akan berjalan sekali saat aplikasi pertama kali dimuat
   const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

        if (storedToken) {
          // Jika ada token, coba verifikasi ke server dengan mengambil profil
          try {
            const userData = await getProfile(storedToken);

        console.log('Data user dari GET PROFILE:', JSON.stringify(userData, null, 2));
            // Jika berhasil, set semua state dengan data asli
            setUser(userData);
            setToken(storedToken);
            setIsAuthenticated(true);

          } catch (error) {
            // Jika getProfile gagal (misal: token kadaluwarsa),
            // berarti token tidak valid. Kita logout pengguna.
            console.log('Token tersimpan tidak valid, melakukan logout.');
            logout(); // Memanggil fungsi logout untuk membersihkan semuanya
          }
        }
      } catch (e) {
        console.error('Gagal mengambil token dari storage', e);
      } finally {
        setIsLoading(false); // Selesai loading, apa pun hasilnya
      }
    };

    loadToken();
  }, []);


// Di dalam komponen AuthProvider di file src/context/AuthContext.tsx

// Di dalam file: src/context/AuthContext.tsx

const login = async (email: string, pass: string) => {
  try {
    const response = await apiLogin(email, pass);

    // Sekarang response sudah lengkap!
    if (response && response.access_token && response.user) {
      
      setToken(response.access_token);
       // TAMBAHKAN INI UNTUK MELIHAT DATA SAAT LOGIN
      console.log('Data user dari LOGIN:', JSON.stringify(response.user, null, 2));
      setUser(response.user); // <-- Langsung gunakan data user dari server
      setIsAuthenticated(true);
      
      await SecureStore.setItemAsync(TOKEN_KEY, response.access_token);

    } else {
      throw new Error('Respons dari server tidak lengkap.');
    }

  } catch (error: any) {
    console.error('Login process failed:', error);
    const errorMessage = error.response?.data?.message || (error as Error).message || 'Terjadi kesalahan.';
    throw new Error(errorMessage);
  }
};

  const logout = async () => {
    // Hapus token dari SecureStore
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    
    // Reset state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };
   // --- TAMBAHKAN FUNGSI BARU DI SINI ---
  const updateUser = (newUserData: User) => {
    setUser(newUserData); // 2. Fungsi ini hanya bertugas meng-update state user
  };
  // Nilai yang akan diberikan ke semua komponen anak
  const value = {
    isAuthenticated,
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser
  };

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk mempermudah penggunaan context ini
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};