import axios from "axios";

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

// Generic API methods
export const apiClient = {
  get: <T>(url: string, params?: any) =>
    api.get<ApiResponse<T>>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: any) =>
    api.post<ApiResponse<T>>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: any) =>
    api.put<ApiResponse<T>>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: any) =>
    api.patch<ApiResponse<T>>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    api.delete<ApiResponse<T>>(url).then((res) => res.data),
};

export default api;
