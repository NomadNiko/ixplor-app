import { Feature, Point } from 'geojson';
import { FetchJsonResponse } from '@/services/api/types/fetch-json-response';

export enum VendorStatusEnum {
  SUBMITTED = 'SUBMITTED',
  PENDING_APPROVAL = 'PENDING_APPROVAL', 
  ACTION_NEEDED = 'ACTION_NEEDED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type VendorType = 'tours' | 'lessons' | 'rentals' | 'tickets';
export type VendorTypes = VendorType | '';

export interface StripeRequirement {
  requirement: string;
  dueDate?: Date;
  error?: string;
}

export interface StripePendingVerification {
  details: string;
  dueBy?: Date;
}

export interface StripeAccountStatus {
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  currentlyDue: string[];
  eventuallyDue: string[];
  pastDue: string[];
  pendingVerification?: StripePendingVerification;
  requirements: StripeRequirement[];
}

export interface StripeVendorInfo {
  stripeConnectId?: string;
  stripeAccountStatus?: StripeAccountStatus;
  accountBalance?: number;
  pendingBalance?: number;
}

export interface VendorProperties {
  _id: string;
  businessName: string;
  description: string;
  vendorTypes: VendorType[];
  website?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  logoUrl?: string;
  vendorStatus: VendorStatusEnum;
  actionNeeded?: string;
  adminNotes?: string;
  ownerIds?: string[];
  createdAt: string;
  updatedAt: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  stripeInfo?: StripeVendorInfo;
}

export type VendorFeature = Feature<Point, VendorProperties>;

export interface Vendor extends Omit<VendorProperties, 'location'> {
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface VendorResponse {
  data: Vendor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type VendorApiResponse = FetchJsonResponse<VendorResponse>;

export interface CreateVendorFormData {
  businessName: string;
  description: string;
  vendorTypes: VendorType[];
  website?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  logoUrl?: { id: string; path: string };
}

export interface EditVendorFormData extends CreateVendorFormData {
  vendorStatus: VendorStatusEnum;
  actionNeeded?: string;
  adminNotes?: string;
}

export enum VendorSortField {
  NAME = 'businessName',
  POSTCODE = 'postalCode',
  CITY = 'city',
  STATE = 'state',
  STATUS = 'vendorStatus',
  CREATED = 'createdAt',
  UPDATED = 'updatedAt'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface VendorFilterType {
  status?: VendorStatusEnum;
  type?: VendorType;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface VendorSortType {
  orderBy: VendorSortField;
  order: SortOrder;
}