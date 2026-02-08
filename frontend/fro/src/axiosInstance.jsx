// src/utils/axiosInstance.js
import axios from "axios";
import { store } from "./redux/store";
import { clearAuth } from "./redux/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// 🔑 Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚪 Handle expired/invalid tokens
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearAuth());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
