import Razorpay from 'razorpay'

// Razorpay configuration
const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || ''

// Check if Razorpay is configured
export const isRazorpayConfigured = razorpayKeyId && razorpayKeySecret

// Server-side Razorpay instance
export const razorpayInstance = isRazorpayConfigured
  ? new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })
  : null

// Payment link options
export interface PaymentLinkOptions {
  amount: number // in paise (₹1 = 100 paise)
  currency?: string
  description: string
  customer: {
    name: string
    email?: string
    contact?: string
  }
  notify?: {
    sms?: boolean
    email?: boolean
  }
  reminder_enable?: boolean
  callback_url?: string
  callback_method?: string
  reference_id?: string
}

// UPI QR Code options
export interface UpiQrOptions {
  amount: number // in paise
  description: string
  customer: {
    name: string
    email?: string
    contact?: string
  }
}
