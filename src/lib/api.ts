import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Requests that failed with 401 while a refresh is already in flight are queued
// and retried once the refresh completes, so concurrent calls only trigger a
// single refresh round-trip.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

const forceLogout = () => {
  const { user, isAuthenticated, logout } = useAuthStore.getState();

  if (!isAuthenticated && !user) return;

  logout();

  if (typeof window !== "undefined") {
    window.location.assign("/auth/login");
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";

    // Never refresh for the refresh endpoint itself, and let the auth mutations
    // (login/register) surface their own errors.
    if (url.includes("/users/generate/refresh")) {
      forceLogout();
      return Promise.reject(error);
    }

    if (url.includes("/users/login") || url.includes("/users/register")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      originalRequest._retry = true;
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.get("/users/generate/refresh");
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
