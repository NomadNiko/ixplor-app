import { VendorStatusEnum, VendorType } from "@/app/[language]/types/vendor";
import { SortEnum } from "@/services/api/types/sort-type";

export type VendorFilterType = {
    status?: VendorStatusEnum;
    type?: VendorType;
    city?: string;
    state?: string;
    postalCode?: string;
  };

export enum VendorSortField {
  NAME = 'businessName',
  POSTCODE = 'postalCode',
  CITY = 'city',
  STATE = 'state',
  STATUS = 'vendorStatus',
  CREATED = 'createdAt',
  UPDATED = 'updatedAt'
}

export type VendorSortType = {
    field: string;
    order: SortEnum;
  };