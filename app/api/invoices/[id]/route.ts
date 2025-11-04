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