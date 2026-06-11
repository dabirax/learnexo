import { getSessionStorage, setSessionStorage } from "@/utils/session";

const baseURL = import.meta.env.VITE_API_BASE_URL;

let refreshPromise: Promise<string> | null = null;

const doFetch = (
  path: string,
  method: string,
  data: unknown,
  token?: string,
): Promise<Response> => {
  const isFormData = data instanceof FormData;
  const headers: Record<string, string> = {};

  const accessToken = token ?? getSessionStorage("accessToken");
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  return fetch(`${baseURL}${path}`, {
    method,
    headers,
    ...(method !== "GET" && data !== undefined
      ? { body: isFormData ? (data as FormData) : JSON.stringify(data) }
      : {}),
  });
};

const parseResponse = async <T>(res: Response): Promise<T> => {
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.error || body?.message || "Something went wrong");
  }
  return body as T;
};

export const makeRequest = async <TResponse = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  data?: unknown,
): Promise<TResponse> => {
  const res = await doFetch(path, method, data);

  if (res.status === 427 && path !== "/auth/refresh-session") {
    if (!refreshPromise) {
      refreshPromise = doFetch("/auth/refresh-session", "POST", undefined)
        .then((r) => r.json())
        .then((d) => {
          setSessionStorage("accessToken", d.accessToken);
          return d.accessToken as string;
        })
        .catch((err) => {
          window.location.href = "/";
          throw err;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newToken = await refreshPromise;
    const retryRes = await doFetch(path, method, data, newToken);
    return parseResponse<TResponse>(retryRes);
  }

  return parseResponse<TResponse>(res);
};
