import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendPasswordResetEmail } from '@/lib/email'
import type { ApiResponse } from '@/lib/validations'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Email is required',
        error: 'Please provide your email address'
      }, { status: 400 })
    }

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Database not configured',
        error: 'Please configure Supabase to use this feature'
      }, { status: 503 })
    }

    // Check if user exists
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name')
      .eq('email', email)
      .single()

    // Always return success to prevent email enumeration
    if (user) {
      // Generate a secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex')
      
      // Token expires in 1 hour
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1)

      // Store token in database
      const { error: tokenError } = await supabaseAdmin
        .from('password_reset_tokens')
        .insert({
          user_id: user.id,
          token: resetToken,
          expires_at: expiresAt.toISOString(),
          used: false
        })

      if (tokenError) {
        console.error('Failed to create reset token:', tokenError)
        // Still return success to prevent email enumeration
      } else {
        // Send password reset email
        await sendPasswordResetEmail({
          name: user.full_name,
          email: user.email,
          resetToken
        })
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions.',
      data: null
    }, { status: 200 })

  } catch (error) {
    console.error('Forgot password error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to process request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
