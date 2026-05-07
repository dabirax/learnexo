import { getSessionStorage } from "../session";
import type { Headers } from "../types/baseTypes";

const api_base_url = import.meta.env.VITE_API_BASE_URL;
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

export const useRequest = async (
  path: string,
  method = "GET",
  body?: string | FormData,
) => {
  console.log("Request sent in module");

  let headers: Headers = {
    "Access-Control-Allow-Credentials": "true",
    Authorization: `Bearer ${getSessionStorage("accessToken")}`,
  };

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  interface RequestOptions {
    method: string;
    headers: Headers;
    body?: string | FormData;
  }

  let requestOptions: RequestOptions = {
    method,
    headers,
  };

  if (method !== "GET") requestOptions = { ...requestOptions, body };

  try {
    let res = await fetch(`${api_base_url}${path}`, requestOptions);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
          `Something went wrong. {${res.statusText} - ${res.status}}`,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("error somewhere: ", error);
      throw new Error(error.message);
    }
    throw new Error(String(error));
  }
};
