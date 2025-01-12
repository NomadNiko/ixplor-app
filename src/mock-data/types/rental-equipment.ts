import { RentalProduct } from '@/types/vendor-types';

const rentalEquipmentMaintenance = [
  {
    id: "m1",
    startDate: "2024-01-01",
    endDate: "2024-01-02",
    reason: "Weekly edge sharpening and waxing",
    itemCount: 6
  },
  {
    id: "m2", 
    startDate: "2024-01-08",
    endDate: "2024-01-09",
    reason: "Regular maintenance and inspection",
    itemCount: 6
  }
];

export const mockRentalEquipment: RentalProduct[] = [
  {
    id: "r1",
    name: "Premium Ski Package",
    category: "Ski Equipment",
    description: "High-performance ski set including boots, poles, and helmet",
    images: ["/img/ski-1.jpg", "/img/ski-2.jpg"],
    totalUnits: 6,
    availableUnits: 3,
    bookedUnits: 2,
    dueOut: 1,
    dueIn: 2,
    sizes: [
      {
        id: "ski-150",
        label: "150cm",
        available: 1,
        total: 2,
        pricePerHour: 20,
        pricePerDay: 75,
        pricePerWeek: 400
      },
      // Additional sizes...
    ],
    condition: "excellent",
    lastServiced: "2024-01-01",
    maintenanceSchedule: rentalEquipmentMaintenance
  },
  // Additional rental equipment...
];
