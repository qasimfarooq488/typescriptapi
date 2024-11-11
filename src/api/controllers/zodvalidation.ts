import { z } from 'zod';
import { position } from '../models/zodschema';  // Importing the position enum from your User schema

// Zod schema for validating query parameters
const GetUsersQuerySchema = z.object({
  gpa: z.string().optional().refine(value => !value || !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 4, {
    message: "GPA must be a number between 0 and 4",
  }),
  position: position.optional(),  // Validating position using the position enum from your schema
  experience: z.string().optional().refine(value => !value || !isNaN(parseInt(value, 10)), {
    message: "Experience must be a valid number",
  }),
});

export { GetUsersQuerySchema };
