import { mockTourTemplates } from './types/tour-templates';
import { mockTourSchedules } from './types/tour-schedules';
import { mockRentalEquipment } from './types/rental-equipment';
import { mockTickets } from './types/tickets';
import { mockLessons } from './types/lessons';
import { VendorProfileDetails } from '@/types/vendor-types';

export const mockVendorDetails: VendorProfileDetails[] = [
  {
    id: "1",
    name: "Waikiki Wave Riders",
    type: "lessons",
    description: "Premier surf school offering private and group lessons for all skill levels",
    status: "published",
    lastUpdated: "2024-01-10",
    lessons: mockLessons
  },
  {
    id: "2",
    name: "Aloha Board Rentals",
    type: "rentals",
    description: "Quality surfboard, paddleboard, and beach equipment rentals",
    status: "published",
    lastUpdated: "2024-01-09",
    rentals: mockRentalEquipment
  },
  {
    id: "3",
    name: "Honolulu Ocean Tours",
    type: "tours",
    description: "Unforgettable snorkeling and whale watching experiences",
    status: "published",
    lastUpdated: "2024-01-08",
    tours: mockTourTemplates.map(template => ({
      ...template,
      schedule: mockTourSchedules.filter(schedule => schedule.productId === template.id)
    }))
  },
  {
    id: "4",
    name: "Waikiki Beach Club",
    type: "tickets",
    description: "Premium beach access and equipment packages",
    status: "published",
    lastUpdated: "2024-01-07",
    tickets: mockTickets
  },
  {
    id: "5",
    name: "Mountain Edge Rentals",
    type: "rentals",
    description: "Premium ski and snowboard rental shop with the latest equipment",
    status: "published",
    lastUpdated: "2024-01-07",
    rentals: mockRentalEquipment
  },
  {
    id: "6",
    name: "Peak Pass Sales",
    type: "tickets",
    description: "Official vendor for seasonal and daily ski passes to Mountain Resort",
    status: "published",
    lastUpdated: "2024-01-06",
    tickets: mockTickets
  },
  {
    id: "7",
    name: "Pro Snowboarding Lessons",
    type: "lessons",
    description: "Professional snowboarding instruction from certified instructors",
    status: "published", 
    lastUpdated: "2024-01-05",
    lessons: mockLessons
  },
  {
    id: "8",
    name: "Alpine Adventure Tours",
    type: "tours",
    description: "Professional guided tours through the most scenic mountain trails",
    status: "published",
    lastUpdated: "2024-01-04",
    tours: mockTourTemplates.map(template => ({
      ...template,
      schedule: mockTourSchedules.filter(schedule => schedule.productId === template.id)
    }))
  }
];