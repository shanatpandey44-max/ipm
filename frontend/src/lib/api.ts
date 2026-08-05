import axios from "axios";

const envApiURL = import.meta.env.VITE_API_URL;
const isLocalhost = typeof window !== "undefined" && window.location.hostname.includes("localhost");
const baseURL = import.meta.env.DEV
  ? envApiURL || "http://localhost:5000/api"
  : isLocalhost
  ? envApiURL || "http://localhost:5000/api"
  : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ipm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    // Auto logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("ipm_token");
      localStorage.removeItem("ipm_user");
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
