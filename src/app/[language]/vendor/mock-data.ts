import { VendorProfileDetails } from "@/types/vendor-types";

export const mockVendorDetails: VendorProfileDetails[] = [
  {
    id: "1",
    name: "Mountain Edge Rentals",
    type: "rentals",
    description: "Premium ski and snowboard rental shop with the latest equipment",
    status: "published",
    lastUpdated: "2024-01-07",
    rentals: [
      {
        id: "r1",
        name: "Premium Ski Package",
        category: "Ski Equipment",
        description: "High-performance ski set for advanced skiers",
        images: ["/img/ski-1.jpg", "/img/ski-2.jpg"],
        totalUnits: 50,
        availableUnits: 32,
        bookedUnits: 15,
        dueOut: 8,
        dueIn: 5,
        sizes: [
          {
            id: "ski-150",
            label: "150cm",
            available: 10,
            total: 15,
            pricePerHour: 20,
            pricePerDay: 75,
            pricePerWeek: 400
          },
          {
            id: "ski-160",
            label: "160cm",
            available: 12,
            total: 15,
            pricePerHour: 20,
            pricePerDay: 75,
            pricePerWeek: 400
          }
        ],
        condition: "excellent",
        lastServiced: "2024-01-01"
      },
    ]
  },
  {
    id: "2",
    name: "Peak Pass Sales",
    type: "tickets",
    description: "Official vendor for seasonal and daily ski passes to Mountain Resort",
    status: "pending",
    actionRequired: "Additional documentation needed",
    lastUpdated: "2024-01-06",
    tickets: [
      {
        id: "t1",
        name: "Full Season Pass 2024",
        type: "season-pass",
        price: 899,
        validFrom: "2024-11-15",
        validTo: "2025-04-15",
        soldCount: 145,
        availableCount: 355
      },
      {
        id: "t2",
        name: "Weekend Day Pass",
        type: "day-pass",
        price: 89,
        validFrom: "2024-01-01",
        validTo: "2024-04-15",
        soldCount: 234,
        availableCount: 1000
      },
      {
        id: "t3",
        name: "5-Day Flex Pass",
        type: "multi-day",
        price: 399,
        validFrom: "2024-01-01",
        validTo: "2024-04-15",
        soldCount: 67,
        availableCount: 133
      }
    ]
  },
  {
    id: "3",
    name: "Pro Snowboarding Lessons",
    type: "lessons",
    description: "Professional snowboarding instruction from certified instructors",
    status: "rejected",
    actionRequired: "Insurance certificate expired",
    lastUpdated: "2024-01-05",
    lessons: [
      {
        id: "l1",
        name: "Private Beginner Lesson",
        instructor: "Jake Burton",
        duration: "2 hours",
        price: 150,
        status: "available"
      },
      {
        id: "l2",
        name: "Group Intermediate Session",
        instructor: "Sarah Palmer",
        duration: "3 hours",
        price: 89,
        status: "booked",
        scheduledDate: "2024-01-15"
      },
      {
        id: "l3",
        name: "Advanced Terrain Park",
        instructor: "Tom Ridge",
        duration: "4 hours",
        price: 199,
        status: "requested"
      }
    ]
  },
  {
    id: "4",
    name: "Alpine Adventure Tours",
    type: "tours",
    description: "Guided backcountry and scenic mountain tours",
    status: "published",
    lastUpdated: "2024-01-04",
    tours: [
      {
        id: "tr1",
        name: "Backcountry Powder Adventure",
        description: "Expert-led backcountry tour to pristine powder locations",
        duration: "6 hours",
        price: 299,
        maxParticipants: 6,
        schedule: [
          {
            id: "s1",
            productId: "tr1",
            date: "2024-01-15",
            startTime: "08:00",
            endTime: "14:00",
            status: "available"
          },
          {
            id: "s2",
            productId: "tr1",
            date: "2024-01-16",
            startTime: "08:00",
            endTime: "14:00",
            status: "booked"
          }
        ]
      },
      {
        id: "tr2",
        name: "Sunset Mountain Tour",
        description: "Scenic evening tour with photography opportunities",
        duration: "3 hours",
        price: 149,
        maxParticipants: 8,
        schedule: [
          {
            id: "s3",
            productId: "tr2",
            date: "2024-01-15",
            startTime: "15:00",
            endTime: "18:00",
            status: "available"
          }
        ]
      }
    ]
  }
];