import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { clientSchema, type ApiResponse, type ClientFormData } from '@/lib/validations'
import { fallbackStorage, shouldUseFallback } from '@/lib/fallback-storage'

/**
 * POST /api/clients
 * Create a new client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validationResult = clientSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid input data',
        error: validationResult.error.errors[0]?.message || 'Validation failed'
      }, { status: 400 })
    }

    const clientData = validationResult.data

    let newClient

    if (shouldUseFallback()) {
      // Use fallback storage for development
      console.log('Using fallback storage for clients')
      
      try {
        // For fallback, we'll store in a separate file
        const fs = require('fs')
        const path = require('path')
        const clientsFile = path.join(process.cwd(), 'data', 'clients.json')
        
        // Ensure data directory exists
        const dataDir = path.dirname(clientsFile)
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true })
        }

        // Read existing clients
        let clients = []
        if (fs.existsSync(clientsFile)) {
          clients = JSON.parse(fs.readFileSync(clientsFile, 'utf-8'))
        }

        // Create new client
        newClient = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          ...clientData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        clients.push(newClient)
        fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2))
      } catch (error) {
        console.error('Fallback storage error:', error)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to save client',
          error: 'Storage error'
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
      // Use fallback storage
      try {
        const fs = require('fs')
        const path = require('path')
        const clientsFile = path.join(process.cwd(), 'data', 'clients.json')
        
        if (fs.existsSync(clientsFile)) {
          clients = JSON.parse(fs.readFileSync(clientsFile, 'utf-8'))
        }
      } catch (error) {
        console.error('Fallback storage error:', error)
        clients = []
      }
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