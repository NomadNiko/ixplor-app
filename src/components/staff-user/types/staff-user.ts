
export enum StaffUserStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
  }
  
  export interface StaffShift {
    _id: string;
    startDateTime: string;
    endDateTime: string;
  }
  
  export interface BookedObject {
    _id: string;
    bookingItemId: string;
    startDateTime: string;
    duration: number;
    transactionId?: string;
    customerId?: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  }
  
  export interface StaffUser {
    _id: string;
    name: string;
    vendorId: string;
    qualifiedProducts: string[];
    shifts: StaffShift[];
    bookedObjects: BookedObject[];
    status: StaffUserStatusEnum;
    email?: string;
    phone?: string;
    notes?: string;
    currentWorkload?: number;
    dailyWorkload?: number;
    qualificationCount?: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface StaffUserResponse {
    data: StaffUser[];
    message?: string;
  }
  
  export interface FilterOptions {
    searchTerm: string;
    filterStatus: string;
    sortOrder: 'asc' | 'desc';
  }