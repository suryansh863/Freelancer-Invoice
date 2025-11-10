import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import type { ApiResponse } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, razorpay_signature } = body

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeySecret) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Demo mode - Payment verification skipped',
        data: { verified: true, isDemoMode: true }
      })
    }

    // Verify signature
    const text = `${razorpay_payment_link_id}|${razorpay_payment_link_reference_id}|${razorpay_payment_link_status}|${razorpay_payment_id}`
    const generated_signature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(text)
      .digest('hex')

    const isValid = generated_signature === razorpay_signature

    if (!isValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Payment verification failed',
        error: 'Invalid signature'
      }, { status: 400 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Payment verified successfully',
      data: {
        verified: true,
        payment_id: razorpay_payment_id,
        reference_id: razorpay_payment_link_reference_id,
        status: razorpay_payment_link_status
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Payment verification failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
