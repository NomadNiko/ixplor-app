import { VendorProfileDetails } from "@/types/vendor-types";

const skiPackageMaintenance = [
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

const snowboardMaintenance = [
  {
    id: "m3",
    startDate: "2024-01-03",
    endDate: "2024-01-04",
    reason: "Bi-weekly edge check and waxing",
    itemCount: 4
  },
  {
    id: "m4", 
    startDate: "2024-01-17",
    endDate: "2024-01-18", 
    reason: "Regular maintenance and inspection",
    itemCount: 4
  }  
];


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
          {
            id: "ski-160",
            label: "160cm",
            available: 2,
            total: 2,
            pricePerHour: 20,
            pricePerDay: 75,
            pricePerWeek: 400
          },
          {
            id: "ski-170",
            label: "170cm",
            available: 0,
            total: 2,
            pricePerHour: 20,
            pricePerDay: 75,
            pricePerWeek: 400
          }
        ],
        condition: "excellent",
        lastServiced: "2024-01-01",
        maintenanceSchedule: skiPackageMaintenance,
      },
      {
        id: "r2",
        name: "Beginner Snowboard Package",
        category: "Snowboard Equipment",
        description: "Entry-level snowboard set with boots and helmet",
        images: ["/img/snowboard-1.jpg", "/img/snowboard-2.jpg"],
        totalUnits: 4,
        availableUnits: 2,
        bookedUnits: 1,
        dueOut: 1,
        dueIn: 1,
        sizes: [
          {
            id: "sb-145",
            label: "145cm",
            available: 1,
            total: 2,
            pricePerHour: 18,
            pricePerDay: 65,
            pricePerWeek: 350
          },
          {
            id: "sb-155",
            label: "155cm",
            available: 1,
            total: 2,
            pricePerHour: 18,
            pricePerDay: 65,
            pricePerWeek: 350
          }
        ],
        condition: "good",
        lastServiced: "2024-01-03",
        maintenanceSchedule: snowboardMaintenance,
      }
    ]
  },
  {
    id: "2",
    name: "Peak Pass Sales",
    type: "tickets",
    description: "Official vendor for seasonal and daily ski passes to Mountain Resort",
    status: "published",
    lastUpdated: "2024-01-06",
    tickets: [
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
      {
        id: "t2",
        name: "Weekend Day Pass",
        type: "day-pass",
        description: "Full day access to all lifts and facilities",
        price: 89,
        validFrom: "2024-01-01",
        validTo: "2024-04-15",
        soldCount: 34,
        availableCount: 40,
        benefits: ["Same-day lift access", "Basic insurance coverage"],
        restrictions: "Valid only for date of purchase"
      },
      {
        id: "t3",
        name: "Weekday Afternoon Pass",
        type: "half-day",
        description: "Access from 12:30 PM until closing",
        price: 59,
        validFrom: "2024-01-01",
        validTo: "2024-04-15",
        soldCount: 22,
        availableCount: 30,
        benefits: ["Afternoon lift access", "Basic insurance coverage"],
        restrictions: "Valid Monday-Friday only, excluding holidays"
      }
    ]
  },
  {
    id: "3",
    name: "Pro Snowboarding Lessons",
    type: "lessons",
    description: "Professional snowboarding instruction from certified instructors",
    status: "published",
    lastUpdated: "2024-01-05",
    lessons: [
      {
        id: "l1",
        name: "Private Beginner Lesson",
        instructor: "Jake Burton",
        duration: "2 hours",
        price: 150,
        status: "available",
        expertise: "Level 3 Certified Instructor",
        languages: ["English", "Spanish"],
        maxStudents: 1,
        includes: ["Basic technique", "Safety instruction", "Equipment guidance"],
        requirements: "No prior experience needed"
      },
      {
        id: "l2",
        name: "Group Intermediate Session",
        instructor: "Sarah Palmer",
        duration: "3 hours",
        price: 89,
        status: "booked",
        scheduledDate: "2024-01-15",
        expertise: "Level 2 Certified Instructor",
        languages: ["English"],
        maxStudents: 4,
        includes: ["Advanced turning", "Speed control", "Terrain adaptation"],
        requirements: "Must be comfortable on blue runs"
      },
      {
        id: "l3",
        name: "Advanced Terrain Park",
        instructor: "Tom Ridge",
        duration: "4 hours",
        price: 199,
        status: "requested",
        expertise: "Freestyle Specialist Level 2",
        languages: ["English", "French"],
        maxStudents: 2,
        includes: ["Jump techniques", "Rail safety", "Trick progression"],
        requirements: "Must be proficient on black runs and basic park features"
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
        maxParticipants: 4,
        requirements: [
          "Advanced skiing/riding ability",
          "Proper winter clothing",
          "Basic avalanche safety knowledge"
        ],
        includes: [
          "Safety equipment rental",
          "Hot lunch",
          "Transportation to/from resort",
          "Photos of your adventure"
        ],
        guide: {
          name: "Mike Thompson",
          certifications: ["AMGA Ski Guide", "Wilderness First Responder"],
          experience: "15 years backcountry guiding"
        },
        schedule: [
          {
            id: "s1",
            productId: "tr1",
            date: "2024-01-15",
            startTime: "08:00",
            endTime: "14:00",
            status: "available",
            currentBookings: 2,
            meetingPoint: "Main Lodge"
          },
          {
            id: "s2",
            productId: "tr1",
            date: "2024-01-16",
            startTime: "08:00",
            endTime: "14:00",
            status: "booked",
            currentBookings: 4,
            meetingPoint: "Main Lodge"
          }
        ]
      },
      {
        id: "tr2",
        name: "Sunset Mountain Tour",
        description: "Scenic evening snowshoe tour with photography opportunities",
        duration: "3 hours",
        price: 149,
        maxParticipants: 6,
        requirements: [
          "Basic fitness level",
          "Warm winter clothing",
          "Camera (optional)"
        ],
        includes: [
          "Snowshoe equipment",
          "Hot beverages",
          "Professional photos",
          "Headlamp"
        ],
        guide: {
          name: "Lisa Chen",
          certifications: ["Wilderness Guide", "Photography Instructor"],
          experience: "8 years mountain guiding"
        },
        schedule: [
          {
            id: "s3",
            productId: "tr2",
            date: "2024-01-15",
            startTime: "15:00",
            endTime: "18:00",
            status: "available",
            currentBookings: 3,
            meetingPoint: "Guest Services Center"
          }
        ]
      }
    ]
  }
];