import axios, { InternalAxiosRequestConfig } from "axios";

// Temporary visual-preview mode. Set VITE_ENABLE_API=true when the backend is ready.
export const API_ENABLED = import.meta.env.VITE_ENABLE_API === "true";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.authCode = "123";

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

export default api;
