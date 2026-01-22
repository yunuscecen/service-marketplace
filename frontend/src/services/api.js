// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Backend adresimiz
  headers: {
    "Content-Type": "application/json",
  },
});

// Her isteğe otomatik Token ekleyen "Interceptor"
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
