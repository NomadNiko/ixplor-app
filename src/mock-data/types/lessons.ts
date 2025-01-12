import { LessonProduct } from '@/types/vendor-types';

export const mockLessons: LessonProduct[] = [
  // Surfing Lessons
  {
    id: "surf-101",
    name: "Private Beginner Surf Lesson",
    instructor: "Kai Miller",
    duration: "2 hours",
    price: 129,
    status: "available",
    expertise: "Level 3 ISA Certified",
    languages: ["English", "Hawaiian"],
    maxStudents: 1,
    includes: [
      "Basic technique",
      "Ocean safety",
      "Equipment provided",
      "Beach awareness"
    ],
    requirements: "Must be able to swim"
  },
  {
    id: "surf-102",
    name: "Group Surf Lesson",
    instructor: "Lani Wong",
    duration: "2 hours",
    price: 79,
    status: "available",
    expertise: "ISA Certified Instructor",
    languages: ["English", "Japanese"],
    maxStudents: 6,
    includes: [
      "Surfboard rental",
      "Safety instruction",
      "Basic techniques",
      "Group practice"
    ],
    requirements: "Basic swimming ability required"
  },
  // Snowboarding Lessons
  {
    id: "snow-101",
    name: "Private Beginner Snowboard Lesson",
    instructor: "Jake Burton",
    duration: "2 hours",
    price: 150,
    status: "available",
    expertise: "Level 3 AASI Certified",
    languages: ["English", "Spanish"],
    maxStudents: 1,
    includes: [
      "Basic technique",
      "Safety instruction",
      "Equipment guidance",
      "Slope etiquette"
    ],
    requirements: "No prior experience needed"
  },
  {
    id: "snow-102",
    name: "Advanced Snowboarding",
    instructor: "Sarah Palmer",
    duration: "3 hours",
    price: 199,
    status: "available",
    expertise: "Level 4 AASI Certified",
    languages: ["English", "French"],
    maxStudents: 3,
    includes: [
      "Advanced techniques",
      "Park riding skills",
      "Jump progression",
      "Video analysis"
    ],
    requirements: "Must be comfortable on black diamond runs"
  }
];