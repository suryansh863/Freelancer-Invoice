import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { ApiResponse } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Email and password are required',
        error: 'Missing credentials'
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

    // Query user from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid email or password',
        error: 'User not found'
      }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid email or password',
        error: 'Invalid password'
      }, { status: 401 })
    }

    // Remove password from response
    const { password_hash, ...userData } = user

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Login successful',
      data: userData
    })

  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
