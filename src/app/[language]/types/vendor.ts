// src/app/[language]/types/vendor.ts
import { Feature, Point } from 'geojson';

export enum VendorStatusEnum {
  SUBMITTED = 'SUBMITTED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTION_NEEDED = 'ACTION_NEEDED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type VendorType = 'tours' | 'lessons' | 'rentals' | 'tickets';

export interface VendorProperties {
  _id: string;
  businessName: string;
  description: string;
  vendorType: VendorType;
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
  createdAt: string;
  updatedAt: string;
}

export type VendorFeature = Feature<Point, VendorProperties>;

export interface Vendor extends VendorProperties {
  longitude?: number;
  latitude?: number;
}

export interface VendorResponse {
  data: Vendor[];
}