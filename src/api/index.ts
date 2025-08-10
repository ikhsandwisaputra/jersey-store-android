// src/api/index.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.129.21:3000', // base URL backend kamu
  timeout: 10000,
});

export default api;
