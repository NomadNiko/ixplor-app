import { Feature, Point } from 'geojson';
import { FetchJsonResponse } from '@/services/api/types/fetch-json-response';

export enum VendorStatusEnum {
  SUBMITTED = 'SUBMITTED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTION_NEEDED = 'ACTION_NEEDED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type VendorTypes = 'tours' | 'lessons' | 'rentals' | 'tickets' | '';

export interface VendorProperties {
  _id: string;
  businessName: string;
  description: string;
  vendorTypes: VendorTypes[];
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
}

export type VendorApiResponse = FetchJsonResponse<VendorResponse>;