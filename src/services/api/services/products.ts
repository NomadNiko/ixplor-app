import { useCallback } from 'react';
import useFetch from '../use-fetch';
import { API_URL } from '../config';
import wrapperFetchJsonResponse from '../wrapper-fetch-json-response';
import { Product, ProductResponse, CreateProductDto, UpdateProductDto } from '../../../app/[language]/types/product';
import { RequestConfigType } from './types/request-config';

// Get all products (public)
export function useGetProductsService() {
  const fetch = useFetch();
  
  return useCallback(async (requestConfig?: RequestConfigType) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      ...requestConfig,
    });
    
    return wrapperFetchJsonResponse<ProductResponse>(response);
  }, [fetch]);
}

// Get all products (admin)
export function useGetAllProductsService() {
  const fetch = useFetch();
  
  return useCallback(async (requestConfig?: RequestConfigType) => {
    const response = await fetch(`${API_URL}/products/admin/all`, {
      method: 'GET',
      ...requestConfig,
    });
    
    return wrapperFetchJsonResponse<ProductResponse>(response);
  }, [fetch]);
}

// Create product
export function useCreateProductService() {
  const fetch = useFetch();
  
  return useCallback(async (data: CreateProductDto, requestConfig?: RequestConfigType) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
      ...requestConfig,
    });
    
    return wrapperFetchJsonResponse<Product>(response);
  }, [fetch]);
}

// Update product
export function useUpdateProductService() {
  const fetch = useFetch();
  
  return useCallback(async (id: string, data: UpdateProductDto, requestConfig?: RequestConfigType) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...requestConfig,
    });
    
    return wrapperFetchJsonResponse<Product>(response);
  }, [fetch]);
}

// Delete product
export function useDeleteProductService() {
  const fetch = useFetch();
  
  return useCallback(async (id: string, requestConfig?: RequestConfigType) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      ...requestConfig,
    });
    
    return wrapperFetchJsonResponse<void>(response);
  }, [fetch]);
}

// Update product status
export function useUpdateProductStatusService() {
  const fetch = useFetch();
  
  return useCallback(async (id: string, status: string, requestConfig?: RequestConfigType) => {
    const response = await fetch(`${API_URL}/products/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      ...requestConfig,
    });
    
    return wrapperFetchJsonResponse<Product>(response);
  }, [fetch]);
}