import { RequestConfigType, ResponseType } from './types/fetch-config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import { API_URL } from '@/services/api/config';

export function useAuthApi() {
  async function fetchJson<T>(
    endpoint: string,
    config?: RequestConfigType
  ): Promise<ResponseType<T>> {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokensInfo.token}`,
        ...config?.headers,
      },
    });

    if (!response.ok && response.status !== 422) {
      throw new Error('API Error');
    }

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json') 
      ? await response.json()
      : null;

    return {
      status: response.status,
      data,
    };
  }

  return { fetchJson };
}