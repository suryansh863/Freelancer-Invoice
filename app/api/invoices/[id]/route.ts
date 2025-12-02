import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { type ApiResponse } from '@/lib/validations'
import { shouldUseFallback } from '@/lib/fallback-storage'
import { demoStorage } from '@/lib/demo-data'
import { calculateInvoiceTotals } from '@/lib/calculations'

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
    
    // Extract items from body
    const { items, tax_rate, tds_rate, ...invoiceData } = body
    
    // Calculate totals if items are provided
    let totals = {}
    if (items && Array.isArray(items)) {
      totals = calculateInvoiceTotals(items, tax_rate || 0, tds_rate || 0, 'individual', false)
    }
    
    // For demo mode, just return success
    if (shouldUseFallback()) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Invoice updated successfully (demo mode)',
        data: { id: invoiceId, ...body }
      })
    }

    // Prepare invoice data with calculated totals
    const invoiceUpdateData = {
      ...invoiceData,
      ...totals
    }

    // Update invoice in Supabase (without items)
    const { data: updatedInvoice, error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .update(invoiceUpdateData)
      .eq('id', invoiceId)
      .select()
      .single()

    if (invoiceError) {
      console.error('Database update error:', invoiceError)
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to update invoice',
        error: 'Database update failed'
      }, { status: 500 })
    }

    // Update items if provided
    if (items && Array.isArray(items)) {
      // Delete existing items
      await supabaseAdmin
        .from('invoice_items')
        .delete()
        .eq('invoice_id', invoiceId)

      // Insert new items
      const itemsToInsert = items.map((item: any) => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount
      }))

      const { error: itemsError } = await supabaseAdmin
        .from('invoice_items')
        .insert(itemsToInsert)

      if (itemsError) {
        console.error('Items update error:', itemsError)
        // Don't fail the whole update if items fail
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Invoice updated successfully',
      data: updatedInvoice
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
