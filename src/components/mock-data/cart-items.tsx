import { CartItemType } from "../../app/[language]/cart/types";

export const mockCartItems: CartItemType[] = [
  {
    id: "1",
    name: "White Water Rafting Adventure",
    description: "Class III Rapids Tour with Professional Guide",
    price: 129.99,
    quantity: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Ark_white_water1101.jpg/1280px-Ark_white_water1101.jpg",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mavericks_Surf_Contest_2010b.jpg/1280px-Mavericks_Surf_Contest_2010b.jpg",
    type: "rental",
    duration: "24 hours"
  },
  {
    id: "3",
    name: "Guided Hiking Tour",
    description: "Scenic Mountain Trail with Expert Guide",
    price: 79.99,
    quantity: 3,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Escursionismo_sulle_Alpi.jpg/1280px-Escursionismo_sulle_Alpi.jpg",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Remic_Rapids%2C_Ottawa%2C_ON_%2814018430256%29.jpg/1280px-Remic_Rapids%2C_Ottawa%2C_ON_%2814018430256%29.jpg",
    type: "rental",
    duration: "4 hours"
  }
];