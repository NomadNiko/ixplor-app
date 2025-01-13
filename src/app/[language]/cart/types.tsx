export type CartItemType = {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    type: "tour" | "rental";
    date?: string; // For tours
    duration?: string; // For tours/rentals
  };