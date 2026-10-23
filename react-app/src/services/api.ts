// src/services/api.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

const API = axios.create({
  baseURL: 'https://fruit-store-api-1.onrender.com/api', // Live Render backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token if it exists in localStorage
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- User Management API Endpoints (Admin Only) ---
export const fetchAllUsers = async () => {
  const response = await API.get('/users');
  return response.data;
};

export const deleteUserById = async (userId: string) => {
  const response = await API.delete(`/users/${userId}`);
  return response.data;
};

export default API;