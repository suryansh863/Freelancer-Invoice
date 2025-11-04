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

// Client validation schema
export const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  company: z.string().max(255).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format').optional().or(z.literal('')),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional().or(z.literal('')),
  client_type: z.enum(['individual', 'company']).default('individual')
})

// Invoice item schema
export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  rate: z.number().min(0, 'Rate must be non-negative'),
  amount: z.number().min(0, 'Amount must be non-negative')
})

// Invoice schema
export const invoiceSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  description: z.string().max(1000).optional().or(z.literal('')),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  tax_rate: z.number().min(0).max(100).default(0),
  tds_rate: z.number().min(0).max(100).default(0),
  notes: z.string().max(1000).optional().or(z.literal('')),
  upi_id: z.string().max(100).optional().or(z.literal(''))
})

// Types
export type ClientFormData = z.infer<typeof clientSchema>
export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type InvoiceItemData = z.infer<typeof invoiceItemSchema>

// Database types
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  gstin?: string
  pan?: string
  client_type: 'individual' | 'company'
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  client_id: string
  client?: Client
  invoice_date: string
  due_date?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  description?: string
  amount: number
  tax_rate: number
  tax_amount: number
  tds_rate: number
  tds_amount: number
  total_amount: number
  cgst_rate: number
  cgst_amount: number
  sgst_rate: number
  sgst_amount: number
  igst_rate: number
  igst_amount: number
  payment_method?: string
  payment_status: 'pending' | 'partial' | 'paid'
  paid_amount: number
  payment_date?: string
  upi_id?: string
  notes?: string
  items?: InvoiceItem[]
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  rate: number
  amount: number
  created_at: string
}