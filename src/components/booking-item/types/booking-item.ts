export enum BookingItemStatusEnum {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
  }
  
  export interface BookingItem {
    _id: string;
    productName: string;
    description: string;
    imageUrl?: string;
    price: number;
    duration: number; // in minutes
    vendorId: string;
    status: BookingItemStatusEnum;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BookingItemResponse {
    data: BookingItem[];
    message?: string;
  }
  
  export interface FilterOptions {
    searchTerm: string;
    filterStatus: string;
    sortOrder: 'asc' | 'desc';
  }