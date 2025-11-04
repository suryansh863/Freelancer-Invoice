import { z } from 'zod'

// Waitlist signup validation schema
export const waitlistSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
  
  profession: z
    .string()
    .min(1, 'Please select a profession')
    .max(100, 'Profession must be less than 100 characters')
})

export type WaitlistFormData = z.infer<typeof waitlistSchema>

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}