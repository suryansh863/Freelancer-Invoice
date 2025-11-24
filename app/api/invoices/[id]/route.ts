import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { type ApiResponse } from '@/lib/validations'
import { shouldUseFallback } from '@/lib/fallback-storage'
import { demoStorage } from '@/lib/demo-data'

/**
 * GET /api/invoices/[id]
 * Get a specific invoice by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id
    let invoice = null

    if (shouldUseFallback()) {
      // Use demo storage
      invoice = demoStorage.getInvoiceById(invoiceId)
    } else {
      // Use Supabase
      const { data, error } = await supabaseAdmin
        .from('invoices')
        .select(`
          *,
          client:clients(*),
          items:invoice_items(*)
        `)
        .eq('id', invoiceId)
        .single()

      if (error) {
        console.error('Database query error:', error)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to fetch invoice',
          error: 'Database query failed'
        }, { status: 500 })
      }

      invoice = data
    }

    if (!invoice) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invoice not found',
        error: 'Invoice with the specified ID does not exist'
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice
    })

  } catch (error) {
    console.error('Invoice API error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    }, { status: 500 })
  }
}

/**
 * PUT /api/invoices/[id]
 * Update an existing invoice
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id
    const body = await request.json()
    
    // For demo mode, just return success
    if (shouldUseFallback()) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Invoice updated successfully (demo mode)',
        data: { id: invoiceId, ...body }
      })
    }

    // Update in Supabase
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .update(body)
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) {
      console.error('Database update error:', error)
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to update invoice',
        error: 'Database update failed'
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Invoice updated successfully',
      data: data
    })

  } catch (error) {
    console.error('Invoice update error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update invoice',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
