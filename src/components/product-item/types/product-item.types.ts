export interface ProductItem {
    _id: string;
    templateId: string;
    templateName: string;
    description: string;
    productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
    productDate: string;
    startTime: string;
    duration?: number;
    price: number;
    quantityAvailable: number;
    quantitySold?: number;
    itemStatus: ProductItemStatus;
    instructorName?: string;
    tourGuide?: string;
    equipmentSize?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    imageURL?: string;
  }
  
  export enum ProductItemStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    DRAFT = 'DRAFT'
  }
  
  export type StatusColor = 'success' | 'error' | 'default';
  
  export interface FilterOptions {
    searchTerm: string;
    filterType: string;
    filterStatus: string;
    sortOrder: 'asc' | 'desc';
  }