import { CartItemType } from "../../app/[language]/cart/types";

export const mockCartItems: CartItemType[] = [
  {
    id: "1",
    name: "White Water Rafting Adventure",
    description: "Class III Rapids Tour with Professional Guide",
    price: 129.99,
    quantity: 2,
    image: "/api/placeholder/200/200",
    type: "tour",
    date: "2025-01-15",
    duration: "4 hours"
  },
  {
    id: "2",
    name: "Premium Surfboard Rental",
    description: "9ft Longboard - Perfect for Beginners",
    price: 49.99,
    quantity: 1,
    image: "/api/placeholder/200/200",
    type: "rental",
    duration: "24 hours"
  },
  {
    id: "3",
    name: "Guided Hiking Tour",
    description: "Scenic Mountain Trail with Expert Guide",
    price: 79.99,
    quantity: 3,
    image: "/api/placeholder/200/200",
    type: "tour",
    date: "2025-01-16",
    duration: "6 hours"
  },
  {
    id: "4",
    name: "Kayak Rental Package",
    description: "Double Kayak with All Safety Equipment",
    price: 65.99,
    quantity: 1,
    image: "/api/placeholder/200/200",
    type: "rental",
    duration: "4 hours"
  }
];