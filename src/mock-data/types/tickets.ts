import { TicketProduct } from '@/types/vendor-types';

export const mockTickets: TicketProduct[] = [
  {
    id: "t1",
    name: "Full Season Pass 2024",
    type: "season-pass",
    description: "Unlimited access for the entire 2024 winter season",
    price: 899,
    validFrom: "2024-11-15",
    validTo: "2025-04-15",
    soldCount: 45,
    availableCount: 55,
    benefits: [
      "Priority lift access",
      "10% off rentals",
      "Free parking",
      "Bring a friend tickets (3x)"
    ],
    restrictions: "Non-transferable, photo ID required"
  },
  // Additional tickets...
];
