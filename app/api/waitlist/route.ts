import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { waitlistSchema, type ApiResponse, type WaitlistFormData } from '@/lib/validations'
import { sendWelcomeEmail } from '@/lib/email'
import { fallbackStorage, shouldUseFallback } from '@/lib/fallback-storage'

/**
 * POST /api/waitlist
 * Handle waitlist signup submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate input data
    const validationResult = waitlistSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid input data',
        error: validationResult.error.errors[0]?.message || 'Validation failed'
      }, { status: 400 })
    }

    const { name, email, profession } = validationResult.data

    let newEntry

    if (shouldUseFallback()) {
      // Use fallback storage for development
      console.log('Using fallback storage (Supabase not configured)')
      
      try {
        // Check if email already exists
        const existingUser = await fallbackStorage.findByEmail(email)
        
        if (existingUser) {
          return NextResponse.json<ApiResponse>({
            success: false,
            message: 'Email already registered',
            error: 'This email is already on our waitlist'
          }, { status: 409 })
        }

        // Insert new entry
        newEntry = await fallbackStorage.insert({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          profession: profession.trim()
        })
      } catch (error) {
        console.error('Fallback storage error:', error)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to save signup',
          error: error instanceof Error ? error.message : 'Storage error'
        }, { status: 500 })
      }
    } else {
      // Use Supabase for production
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('waitlist')
        .select('email')
        .eq('email', email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        console.error('Database check error:', checkError)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Database error occurred',
          error: 'Failed to check existing user'
        }, { status: 500 })
      }

      if (existingUser) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Email already registered',
          error: 'This email is already on our waitlist'
        }, { status: 409 })
      }

      // Insert new waitlist entry
      const { data: insertedEntry, error: insertError } = await supabaseAdmin
        .from('waitlist')
        .insert([{
          name: name.trim(),
          email: email.toLowerCase().trim(),
          profession: profession.trim()
        }])
        .select()
        .single()

      if (insertError) {
        console.error('Database insert error:', insertError)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to save signup',
          error: 'Database insertion failed'
        }, { status: 500 })
      }

      newEntry = insertedEntry
    }

    // Send welcome email (optional, won't fail if email service is not configured)
    const emailResult = await sendWelcomeEmail({ name, email, profession })
    
    if (!emailResult.success) {
      console.warn('Welcome email failed:', emailResult.error)
      // Don't fail the signup if email fails
    }

    // Return success response
    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Successfully joined the waitlist!',
      data: {
        id: newEntry.id,
        name: newEntry.name,
        email: newEntry.email,
        profession: newEntry.profession,
        emailSent: emailResult.success
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Waitlist API error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    }, { status: 500 })
  }
}

/**
 * GET /api/waitlist
 * Get waitlist statistics (optional endpoint for admin use)
 */
export async function GET() {
  try {
    let count = 0

    if (shouldUseFallback()) {
      // Use fallback storage
      count = await fallbackStorage.count()
    } else {
      // Use Supabase
      const { count: supabaseCount, error } = await supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Database count error:', error)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to get waitlist count',
          error: 'Database query failed'
        }, { status: 500 })
      }

      count = supabaseCount || 0
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Waitlist statistics retrieved',
      data: { count }
    })

  } catch (error) {
    console.error('Waitlist stats API error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    }, { status: 500 })
  }
}