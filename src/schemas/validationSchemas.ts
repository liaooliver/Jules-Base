import { z } from 'zod';

// Schema for login form
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

// Infer TypeScript type from the schema
export type LoginFormInputs = z.infer<typeof loginSchema>;
