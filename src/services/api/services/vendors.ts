import { RequestConfigType } from '@/services/api/types/fetch-config';
import { fetchJson } from '@/services/api/fetch-json';
import { API_URL } from '@/services/api/config';
import { 
  Vendor, 
  VendorResponse, 
  VendorApiResponse, 
  VendorFilterType, 
  VendorSortType 
} from '@/app/[language]/types/vendor';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { useCallback } from 'react';
import useFetch from '../use-fetch';
import wrapperFetchJsonResponse from '../wrapper-fetch-json-response';

export function useGetVendorsService() {
  const fetch = useFetch();
  
  return useCallback(async (requestConfig?: RequestConfigType) => {
    const requestUrl = new URL(`${API_URL}/vendors`);
    const response = await fetch(requestUrl, {
      method: 'GET',
      ...requestConfig,
    });
    
    return wrapperFetchJsonResponse<VendorResponse>(response);
  }, [fetch]);
}


export const useNewGetVendorsService = () => {
  return async (params: { 
    page?: number; 
    limit?: number; 
    filters?: VendorFilterType;
    sort?: VendorSortType[];
  } = {}): Promise<VendorApiResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params?.filters) {
      searchParams.append('filters', JSON.stringify(params.filters));
    }
    if (params?.sort) {
      const sortParams = params.sort.map(sort => `${sort.orderBy},${sort.order}`).join('|');
      searchParams.append('sort', sortParams);
    }

    const response = await fetchJson<VendorResponse>(
      `/v1/vendors?${searchParams.toString()}`,
      {}
    );

    return {
      status: HTTP_CODES_ENUM.OK,
      data: response
    };
  };
};

export function useGetAllVendorsService() {
  return async (params?: {
    page?: number;
    limit?: number;
  }, config?: RequestConfigType): Promise<VendorApiResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    const response = await fetchJson<VendorResponse>(
      `/v1/vendors/admin/all?${searchParams.toString()}`,
      {
        ...config,
      }
    );
    return {
      status: HTTP_CODES_ENUM.OK,
      data: response
    };
  };
}
export type GetVendorServiceResponse = 
  | { status: HTTP_CODES_ENUM.OK; data: { data: Vendor }; }
  | { status: HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY; errors: Record<string, string>; }
  | undefined;

  export const useGetVendorService = () => {
    return async (params: { 
      page?: number; 
      limit?: number; 
      filters?: VendorFilterType 
    } = {}): Promise<VendorApiResponse> => {
      const searchParams = new URLSearchParams();
  
      if (params?.page) {
        searchParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        searchParams.append('limit', params.limit.toString());
      }
      if (params?.filters) {
        searchParams.append('filters', JSON.stringify(params.filters));
      }
  
      const response = await fetchJson<VendorResponse>(
        `/v1/vendors?${searchParams.toString()}`,
        {}
      );
  
      return {
        status: HTTP_CODES_ENUM.OK,
        data: response
      };
    };
  };

export type DeleteVendorServiceResponse = 
  | { status: HTTP_CODES_ENUM.OK; }
  | { status: HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY; errors: Record<string, string>; }
  | undefined;

export const useDeleteVendorService = () => {
  return async (params: { id: string }, config?: RequestConfigType): Promise<DeleteVendorServiceResponse> => {
    try {
      await fetchJson<void>(`${params.id}`, {
        method: 'DELETE',
        ...config,
      });

      return { status: HTTP_CODES_ENUM.OK };
    } catch (error) {
      return undefined;
    }
  };
};

export type PatchVendorServiceResponse = 
  | { status: HTTP_CODES_ENUM.OK; data: Vendor; }
  | { status: HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY; errors: Record<string, string>; }
  | undefined;

export const usePatchVendorService = () => {
  return async (params: { 
    id: string; 
    data: Partial<Vendor> 
  }, config?: RequestConfigType): Promise<PatchVendorServiceResponse> => {
    try {
      const response = await fetchJson<Vendor>(
        `/v1/vendors/${params.id}`, 
        {
          method: 'PATCH',
          body: JSON.stringify(params.data),
          ...config,
        }
      );

      return {
        status: HTTP_CODES_ENUM.OK,
        data: response
      };
    } catch (error) {
      return undefined;
    }
  };
};