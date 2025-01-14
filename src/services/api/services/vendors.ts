import { useCallback } from 'react';
import useFetch from '../use-fetch';
import { API_URL } from '../config';
import wrapperFetchJsonResponse from '../wrapper-fetch-json-response';
import { RequestConfigType } from './types/request-config';
import { VendorResponse } from '@/app/[language]/types/vendor';

export function useGetVendorsService() {
  const fetch = useFetch();
  
  return useCallback(async (requestConfig?: RequestConfigType) => {
    const requestUrl = new URL(`${API_URL}/v1/vendors`);
    return fetch(requestUrl, {
      method: 'GET',
      ...requestConfig,
    }).then(wrapperFetchJsonResponse<VendorResponse>);
  }, [fetch]);
}

export function useGetNearbyVendorsService() {
  const fetch = useFetch();
  
  return useCallback(async (
    lat: number,
    lng: number, 
    radius?: number,
    requestConfig?: RequestConfigType
  ) => {
    const requestUrl = new URL(`${API_URL}/v1/vendors/nearby`);
    requestUrl.searchParams.append('lat', lat.toString());
    requestUrl.searchParams.append('lng', lng.toString());
    if (radius) {
      requestUrl.searchParams.append('radius', radius.toString());
    }
    
    return fetch(requestUrl, {
      method: 'GET',
      ...requestConfig,
    }).then(wrapperFetchJsonResponse<VendorResponse>);
  }, [fetch]);
}