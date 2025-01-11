import { LessonProduct } from '@/types/vendor-types';

export const mockLessons: LessonProduct[] = [
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
    includes: [
      "Basic technique",
      "Safety instruction",
      "Equipment guidance"
    ],
    requirements: "No prior experience needed"
  },
  // Additional lessons...
];