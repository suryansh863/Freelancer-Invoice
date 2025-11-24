import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { ApiResponse } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Missing required fields',
        error: 'Token and password are required'
      }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid password',
        error: 'Password must be at least 8 characters long'
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

    // Find the reset token
    const { data: resetToken, error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (tokenError || !resetToken) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid or expired token',
        error: 'This password reset link is invalid or has already been used'
      }, { status: 400 })
    }

    // Check if token has expired
    const now = new Date()
    const expiresAt = new Date(resetToken.expires_at)
    
    if (now > expiresAt) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Token expired',
        error: 'This password reset link has expired. Please request a new one.'
      }, { status: 400 })
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10)

    // Update user's password
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', resetToken.user_id)

    if (updateError) {
      console.error('Failed to update password:', updateError)
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to reset password',
        error: 'Database error'
      }, { status: 500 })
    }

    // Mark token as used
    await supabaseAdmin
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', resetToken.id)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Password reset successful',
      data: null
    }, { status: 200 })

  } catch (error) {
    console.error('Reset password error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to reset password',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
