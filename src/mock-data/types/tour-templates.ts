import { TourTemplate } from '@/types/vendor-types';

export const mockTourTemplates: TourTemplate[] = [
  {
    id: "tr1",
    name: "Backcountry Powder Adventure",
    description: "Expert-led backcountry tour to pristine powder locations with stunning views",
    duration: "6 hours",
    price: 299,
    maxParticipants: 4,
    difficulty: "advanced",
    rating: 4.8,
    totalReviews: 24,
    seasonalAvailability: {
      startDate: "2024-11-15",
      endDate: "2025-04-15",
    },
    requirements: [
      "Advanced skiing/riding ability",
      "Proper winter clothing", 
      "Basic avalanche safety knowledge"
    ],
    includes: [
      "Safety equipment rental",
      "Hot lunch",
      "Transportation to/from resort",
      "Professional photos"
    ],
    meetingPoint: {
      name: "Main Lodge",
      coordinates: {
        lat: 39.1911,
        lng: -106.8175,
      },
      description: "Meet at the fireplace in Main Lodge lobby"
    },
    guide: {
      id: "g1",
      name: "Mike Thompson",
      photo: "/img/guides/mike-thompson.jpg",
      certifications: [
        "AMGA Ski Guide",
        "Wilderness First Responder",
        "Avalanche Level 3 Certified"
      ],
      experience: "15 years backcountry guiding",
      languages: ["English", "Spanish"],
      specialties: ["Backcountry Skiing", "Avalanche Safety", "Alpine Climbing"],
      availability: "full-time",
      rating: 4.9,
      totalTours: 156
    }
  },
  // Add additional tour templates...
];