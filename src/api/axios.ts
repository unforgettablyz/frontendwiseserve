import axios, { InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach auth headers automatically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach demo header as required by backend handbook
    config.headers.authCode = "123";

    // Attach JWT token if user is logged in
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
