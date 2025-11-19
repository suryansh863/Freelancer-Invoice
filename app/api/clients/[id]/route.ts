import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { type ApiResponse } from '@/lib/validations'
import { shouldUseFallback } from '@/lib/fallback-storage'

/**
 * PUT /api/clients/[id]
 * Update an existing client
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    const body = await request.json()
    
    // For demo mode, just return success
    if (shouldUseFallback()) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Client updated successfully (demo mode)',
        data: { id: clientId, ...body }
      })
    }

    // Update in Supabase
    const { data, error } = await supabaseAdmin
      .from('clients')
      .update(body)
      .eq('id', clientId)
      .select()
      .single()

    if (error) {
      console.error('Database update error:', error)
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to update client',
        error: 'Database update failed'
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Client updated successfully',
      data: data
    })

  } catch (error) {
    console.error('Client update error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update client',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
