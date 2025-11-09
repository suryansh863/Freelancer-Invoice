import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { clientSchema, type ApiResponse, type ClientFormData } from '@/lib/validations'
import { shouldUseFallback } from '@/lib/fallback-storage'
import { demoStorage } from '@/lib/demo-data'

/**
 * POST /api/clients
 * Create a new client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received client data:', body)
    
    // Validate input data
    const validationResult = clientSchema.safeParse(body)
    
    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.errors)
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid input data',
        error: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      }, { status: 400 })
    }

    const clientData = validationResult.data as Omit<ClientFormData, 'id' | 'created_at' | 'updated_at'>
    console.log('Validated client data:', clientData)

    let newClient

    if (shouldUseFallback()) {
      // Use demo storage for development
      console.log('Using demo storage for clients')
      
      try {
        newClient = demoStorage.addClient(clientData as any)
        console.log('Client added successfully:', newClient)
      } catch (error) {
        console.error('Demo storage error:', error)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to save client',
          error: error instanceof Error ? error.message : 'Storage error'
        }, { status: 500 })
      }
    } else {
      // Use Supabase for production
      const { data: insertedClient, error: insertError } = await supabaseAdmin
        .from('clients')
        .insert([clientData])
        .select()
        .single()

      if (insertError) {
        console.error('Database insert error:', insertError)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to save client',
          error: 'Database insertion failed'
        }, { status: 500 })
      }

      newClient = insertedClient
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Client created successfully',
      data: newClient
    }, { status: 201 })

  } catch (error) {
    console.error('Clients API error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    }, { status: 500 })
  }
}

/**
 * GET /api/clients
 * Get all clients
 */
export async function GET() {
  try {
    let clients = []

    if (shouldUseFallback()) {
      // Use demo storage
      clients = demoStorage.getClients()
    } else {
      // Use Supabase
      const { data, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database query error:', error)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to fetch clients',
          error: 'Database query failed'
        }, { status: 500 })
      }

      clients = data || []
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Clients retrieved successfully',
      data: clients
    })

  } catch (error) {
    console.error('Clients API error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    }, { status: 500 })
  }
}