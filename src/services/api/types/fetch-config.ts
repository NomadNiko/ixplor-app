export type RequestBody = 
  | string 
  | Blob 
  | ArrayBufferView 
  | ArrayBuffer 
  | FormData 
  | URLSearchParams 
  | ReadableStream<Uint8Array>
  | null;

export interface RequestConfigType {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    signal?: AbortSignal;
    body?: RequestBody;
}

export interface ResponseType<T = unknown> {
    status: number;
    data: T;
    errors?: Record<string, string>;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface SortParams {
    field: string;
    order: 'asc' | 'desc';
}

export type FilterParams = Record<string, string | number | boolean | undefined>;