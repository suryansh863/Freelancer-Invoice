import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { ApiResponse } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, phone, businessName, gstin, pan, address, password } = body

    // Validate required fields
    if (!fullName || !email || !phone || !pan || !address || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Missing required fields',
        error: 'Please fill in all required fields'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid email format',
        error: 'Please enter a valid email address'
      }, { status: 400 })
    }

    // Validate PAN format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    if (!panRegex.test(pan)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid PAN format',
        error: 'PAN should be in format: AAAAA0000A'
      }, { status: 400 })
    }

    // Validate GSTIN if provided
    if (gstin) {
      // Check if GSTIN is exactly 15 characters and alphanumeric
      if (gstin.length !== 15) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Invalid GSTIN format',
          error: 'GSTIN should be exactly 15 characters'
        }, { status: 400 })
      }
      
      // Optional: More strict validation (can be commented out if too strict)
      const gstinRegex = /^[0-9]{2}[A-Z0-9]{13}$/
      if (!gstinRegex.test(gstin.toUpperCase())) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Invalid GSTIN format',
          error: 'GSTIN should start with 2 digits followed by 13 alphanumeric characters'
        }, { status: 400 })
      }
    }

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      // Demo mode - create demo user
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Demo account created successfully',
        data: {
          id: `demo-${Date.now()}`,
          email: email,
          fullName: fullName,
          phone: phone,
          businessName: businessName || '',
          gstin: gstin || '',
          pan: pan,
          address: address,
          isDemoMode: true,
          created_at: new Date().toISOString()
        }
      })
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Email already registered',
        error: 'An account with this email already exists'
      }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([{
        full_name: fullName,
        email: email,
        phone: phone,
        business_name: businessName || null,
        gstin: gstin || null,
        pan: pan,
        address: address,
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to create account',
        error: 'Database error'
      }, { status: 500 })
    }

    // Remove password from response
    const { password_hash, ...userData } = newUser

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Account created successfully',
      data: userData
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Signup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
