import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { API_URL } from "./config";

export interface FetchJsonConfig extends RequestInit {
  signal?: AbortSignal;
}

export const fetchJson = async <T>(
  endpoint: string,
  config?: FetchJsonConfig
): Promise<T> => {
  const tokensInfo = getTokensInfo();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (tokensInfo?.token) {
    headers.Authorization = `Bearer ${tokensInfo.token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...config,
    headers: {
      ...headers,
      ...config?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};