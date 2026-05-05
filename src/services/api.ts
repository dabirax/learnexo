import axios from "axios";

import { getSessionStorage } from "@/utils/session";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getSessionStorage("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 427 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-session"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post(`/auth/refresh-session`);

        const newToken = res.data.accessToken;
        sessionStorage.setItem("accessToken", newToken);

        processQueue(null, newToken);

        console.log("Retrying requests with new access token");
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        window.location.href = "/";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Something went wrong";

      console.log(message)

    return Promise.reject(new Error(message));
  },
);

export const makeRequest = async <TResponse = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  data?: any,
) => {
  const res = await api.request<TResponse>({
    url: path,
    method,
    data,
  });

  const response = res.data;
  console.log(response);

  return response;
};
