import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { APP_CONFIG } from "~/config";

// Shared state for token refresh across all axios instances
let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const subscribeTokenRefresh = (callback: (success: boolean) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshComplete = (success: boolean) => {
  refreshSubscribers.forEach((callback) => callback(success));
  refreshSubscribers = [];
};

export const createAxiosInstance = (
  clientUrl: string,
  headers?: Record<string, string>
) => {
  const instance = axios.create({
    timeout: 120000,
    baseURL: `${APP_CONFIG.API_URL}/${clientUrl}`,
    withCredentials: true, // Send cookies with requests
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  // Response interceptor - Handle 401 errors with automatic refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Skip refresh for auth endpoints
      const isAuthEndpoint =
        originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/register") ||
        originalRequest.url?.includes("/refresh") ||
        originalRequest.url?.includes("/logout");

      // Handle 401 errors with automatic token refresh via cookie
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isAuthEndpoint
      ) {
        originalRequest._retry = true;

        // If already refreshing, wait for the refresh to complete
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((success) => {
              if (success) {
                resolve(instance(originalRequest));
              } else {
                reject(error);
              }
            });
          });
        }

        isRefreshing = true;

        try {
          // Call refresh endpoint - cookies sent automatically
          await axios.post(
            `${APP_CONFIG.API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          isRefreshing = false;
          onRefreshComplete(true);

          // Retry original request - new cookies will be sent automatically
          return instance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          onRefreshComplete(false);

          // Refresh failed - only redirect if not already on sign-in page
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (
              !currentPath.includes("/sign-in") &&
              !currentPath.includes("/sign-up")
            ) {
              console.log("[Axios] Refresh failed, redirecting to sign-in");
              window.location.href = "/sign-in";
            }
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
