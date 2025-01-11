import { mockTourTemplates } from './types/tour-templates';
import { mockTourSchedules } from './types/tour-schedules';
import { mockRentalEquipment } from './types/rental-equipment';
import { mockTickets } from './types/tickets';
import { mockLessons } from './types/lessons';
import { VendorProfileDetails } from '@/types/vendor-types';

export const mockVendorDetails: VendorProfileDetails[] = [
  {
    id: "1",
    name: "Mountain Edge Rentals",
    type: "rentals",
    description: "Premium ski and snowboard rental shop with the latest equipment",
    status: "published",
    lastUpdated: "2024-01-07",
    rentals: mockRentalEquipment
  },
  {
    id: "2",
    name: "Peak Pass Sales",
    type: "tickets",
    description: "Official vendor for seasonal and daily ski passes to Mountain Resort",
    status: "published",
    lastUpdated: "2024-01-06",
    tickets: mockTickets
  },
  {
    id: "3",
    name: "Pro Snowboarding Lessons",
    type: "lessons",
    description: "Professional snowboarding instruction from certified instructors",
    status: "published", 
    lastUpdated: "2024-01-05",
    lessons: mockLessons
  },
  {
    id: "4",
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