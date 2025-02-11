export interface InvoiceResponseDto {
    _id: string;
    stripeCheckoutSessionId: string;
    amount: number;
    currency: string;
    vendorId: string;
    customerId: string;
    productItemIds: string[];
    status: string;
    type: string;
    description: string;
  }