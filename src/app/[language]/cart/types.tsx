export type CartItemType = {
  productId: string;
  productName: string;
  productDescription?: string;
  price: number;
  quantity: number;
  productImageURL?: string;
  vendorId?: string;
  productType: "tours" | "lessons" | "rentals" | "tickets";
  productDate?: string;
  productStartTime?: string;
};

export interface CartResponse {
  userId: string;
  items: CartItemType[];
  total: number;
  createdAt: string;
  updatedAt: string;
}