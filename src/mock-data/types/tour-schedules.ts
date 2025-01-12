// src/mock-data/types/tour-schedules.ts
import { TourProduct } from '@/types/vendor-types';

// Using the type from TourProduct's schedule property
type TourSchedule = TourProduct['schedule'][0];

export const mockTourSchedules: TourSchedule[] = [
  {
    id: "s1",
    productId: "tr1",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "14:00",
    status: "available",
    currentBookings: 2,
    meetingPoint: "Main Lodge",
    guideId: "g1",
    weatherForecast: {
      condition: "sunny",
      temperature: 28,
      snowCondition: "powder"
    },
    notes: "Perfect conditions expected"
  }
];