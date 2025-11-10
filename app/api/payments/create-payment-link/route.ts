import { NextRequest, NextResponse } from 'next/server'
import { razorpayInstance, isRazorpayConfigured } from '@/lib/razorpay'
import type { ApiResponse } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoiceId, amount, currency = 'INR', description, customer, callbackUrl } = body

    // Validate required fields
    if (!amount || !description || !customer?.name) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Missing required fields',
        error: 'Amount, description, and customer name are required'
      }, { status: 400 })
    }

    // Check if Razorpay is configured
    if (!isRazorpayConfigured || !razorpayInstance) {
      // Return demo payment link for development
      const demoLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/demo-payment?invoice=${invoiceId}&amount=${amount}`
      
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Demo payment link created (Razorpay not configured)',
        data: {
          id: `demo_${Date.now()}`,
          short_url: demoLink,
          amount: amount,
          currency: currency,
          description: description,
          status: 'created',
          isDemoMode: true
        }
      })
    }

    // Create Razorpay payment link
    const paymentLink = await razorpayInstance.paymentLink.create({
      amount: amount, // amount in paise
      currency: currency,
      description: description,
      customer: {
        name: customer.name,
        email: customer.email || undefined,
        contact: customer.contact || undefined,
      },
      notify: {
        sms: !!customer.contact,
        email: !!customer.email,
      },
      reminder_enable: true,
      callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
      callback_method: 'get',
      reference_id: invoiceId,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Payment link created successfully',
      data: paymentLink
    })

  } catch (error) {
    console.error('Payment link creation error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to create payment link',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
