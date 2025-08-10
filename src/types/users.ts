// src/types/users.ts
export interface UserApiResponse {
  id_user: number;
  name: string;
  email: string;
  password?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
