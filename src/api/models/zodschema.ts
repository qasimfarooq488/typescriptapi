
import { z } from 'zod';

// Enum for position
export const position = z.enum(['Software Engineer', 'ML Engineer', 'UI/UX Designer']);

// Enum for experience


// Define the user schema using Zod
export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),  // Name must be a non-empty string
  age: z.number().int().positive().optional(),  // Age is optional, but must be a positive integer
  email: z.string().email("Invalid email format"),  // Email validation with Zod's built-in email validator
  position: position,  // Position must be one of the values defined in the position enum
  gpa: z.number()
    .min(0, "GPA cannot be less than 0")
    .max(4, "GPA cannot be more than 4")
    .refine(val => val >= 2, "GPA must be at least 2 for eligibility"),  // GPA must be at least 2 for eligibility
  experience:z.number().positive() // Experience must be one of the values defined in the experience enum
});


export type UserType = z.infer<typeof UserSchema>;
