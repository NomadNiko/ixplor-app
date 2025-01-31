export interface StripePendingVerification {
    details: string;
    dueBy?: Date;
  }
  
  export interface StripeRequirement {
    requirement: string;
    dueDate?: Date;
    error?: string;
  }
  
  export interface StripeAccountStatus {
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
    pendingVerification?: StripePendingVerification;
    errors: StripeRequirement[];
  }
  
  export interface VendorStatus {
    _id: string;
    businessName: string;
    stripeAccountStatus: StripeAccountStatus;
    accountBalance: number;
    pendingBalance: number;
    vendorStatus: string;
    actionNeeded?: string;
    hasProducts: boolean;
  }