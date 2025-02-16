export interface InvoiceItem {
    productItemId: string;
    productName: string;
    price: number;
    quantity: number;
    productDate: string;
    productStartTime: string;
    productDuration: number;
  }
  
  export interface InvoiceResponseDto {
    _id: string;
    stripeCheckoutSessionId: string;
    amount: number;
    currency: string;
    vendorId: string;
    vendorName: string;
    customerId: string;
    customerName: string;
    productItemIds: string[];
    items: InvoiceItem[];
    status: string;
    type: string;
    invoiceDate: Date;
    description: string;
  }