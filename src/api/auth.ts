// src/api/users.ts
import api from './index';
import { UserApiResponse, User } from '../types/users';
// Tentukan tipe data balasan dari endpoint login Anda
// Sesuaikan ini dengan respons dari backend Anda
interface LoginResponse {
  access_token: string;
  user: User; // Menggunakan kembali tipe User yang sudah ada
}

// Fungsi untuk melakukan login
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Panggil endpoint login di backend Anda.
    // Saya berasumsi endpointnya adalah POST /auth/login.
    // Jika berbeda, silakan disesuaikan (misal: /login atau /users/login)
    const response = await api.post<LoginResponse>('/login', {
      email,
      password,
    });
    return response.data; // response.data harus berisi { token: "...", user: {...} }
  } catch (error) {
    console.error('Error during login:', error);
    // Lempar error agar bisa ditangkap oleh komponen UI
    throw error;
  }
};

export const getProfile = async (token: string): Promise<User> => {
  try {
    // Pastikan URL-nya adalah '/auth/profile'
    const response = await api.get<User>('/login/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
// GET /users
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<UserApiResponse[]>('/users');
    return response.data.map((item) => ({
      id: item.id_user,
      name: item.name,
      email: item.email,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// GET /users/:id
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await api.get<UserApiResponse>(`/users/${id}`);
    const item = response.data;
    return {
      id: item.id_user,
      name: item.name,
      email: item.email,
    };
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// POST /users
export const createUser = async (data: Omit<UserApiResponse, 'id_user'>): Promise<User> => {
  try {
    const response = await api.post<UserApiResponse>('/users', data);
    const item = response.data;
    return {
      id: item.id_user,
      name: item.name,
      email: item.email,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// POST /users/seeder-data
export const seedUsers = async (): Promise<string> => {
  try {
    const response = await api.post('/users/seeder-data');
    return response.data.message || 'Seeder completed';
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// PATCH /users/:id
export const updateUser = async (id: number, data: Partial<UserApiResponse>): Promise<User> => {
  try {
    const response = await api.patch<UserApiResponse>(`/users/${id}`, data);
    const item = response.data;
    return {
      id: item.id_user,
      name: item.name,
      email: item.email,
    };
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// PATCH /users/update-password/:id
export const updateUserPassword = async (id: number, newPassword: string): Promise<string> => {
  try {
    const response = await api.patch(`/users/update-password/${id}`, { password: newPassword });
    return response.data.message || 'Password updated successfully';
  } catch (error) {
    console.error(`Error updating password for user ${id}:`, error);
    throw error;
  }
};

// PATCH /users/update-email/:id
export const updateUserEmail = async (id: number, newEmail: string): Promise<string> => {
  try {
    const response = await api.patch(`/users/update-email/${id}`, { email: newEmail });
    return response.data.message || 'Email updated successfully';
  } catch (error) {
    console.error(`Error updating email for user ${id}:`, error);
    throw error;
  }
};

// DELETE /users/:id
export const deleteUser = async (id: number): Promise<string> => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data.message || 'User deleted successfully';
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};
