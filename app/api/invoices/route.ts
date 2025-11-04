import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { invoiceSchema, type ApiResponse, type InvoiceFormData } from '@/lib/validations'
import { calculateInvoiceTotals } from '@/lib/calculations'
import { shouldUseFallback } from '@/lib/fallback-storage'
import { demoStorage } from '@/lib/demo-data'

/**
 * POST /api/invoices
 * Create a new invoice
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validationResult = invoiceSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid input data',
        error: validationResult.error.errors[0]?.message || 'Validation failed'
      }, { status: 400 })
    }

    const { items, client_id, tax_rate, tds_rate, ...invoiceData } = validationResult.data

    // Calculate totals
    const totals = calculateInvoiceTotals(items, tax_rate, tds_rate, 'individual', false)

    let newInvoice

    if (shouldUseFallback()) {
      // Use demo storage for development
      console.log('Using demo storage for invoices')
      
      try {
        const invoiceToCreate = {
          client_id,
          ...invoiceData,
          amount: totals.subtotal,
          ...totals
        }

        newInvoice = demoStorage.addInvoice(invoiceToCreate, items)
      } catch (error) {
        console.error('Demo storage error:', error)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to save invoice',
          error: 'Storage error'
        }, { status: 500 })
      }
    } else {
      // Use Supabase for production
      
      // Generate invoice number
      const { data: invoiceNumberData } = await supabaseAdmin
        .rpc('generate_invoice_number')

      const invoiceNumber = invoiceNumberData || `INV-${Date.now()}`

      // Create invoice
      const invoiceToInsert = {
        invoice_number: invoiceNumber,
        client_id,
        ...invoiceData,
        status: 'draft',
        amount: totals.subtotal,
        ...totals,
        payment_status: 'pending',
        paid_amount: 0
      }

      const { data: insertedInvoice, error: invoiceError } = await supabaseAdmin
        .from('invoices')
        .insert([invoiceToInsert])
        .select()
        .single()

      if (invoiceError) {
        console.error('Database insert error:', invoiceError)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to save invoice',
          error: 'Database insertion failed'
        }, { status: 500 })
      }

      // Create invoice items
      const itemsToInsert = items.map(item => ({
        invoice_id: insertedInvoice.id,
        ...item
      }))

      const { data: insertedItems, error: itemsError } = await supabaseAdmin
        .from('invoice_items')
        .insert(itemsToInsert)
        .select()

      if (itemsError) {
        console.error('Database items insert error:', itemsError)
        // Try to clean up the invoice if items failed
        await supabaseAdmin.from('invoices').delete().eq('id', insertedInvoice.id)
        
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to save invoice items',
          error: 'Database insertion failed'
        }, { status: 500 })
      }

      newInvoice = {
        ...insertedInvoice,
        items: insertedItems
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Invoice created successfully',
      data: newInvoice
    }, { status: 201 })

  } catch (error) {
    console.error('Invoices API error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    }, { status: 500 })
  }
}

/**
 * GET /api/invoices
 * Get all invoices with client information
 */
export async function GET() {
  try {
    let invoices = []

    if (shouldUseFallback()) {
      // Use demo storage
      invoices = demoStorage.getInvoices()
    } else {
      // Use Supabase
      const { data, error } = await supabaseAdmin
        .from('invoices')
        .select(`
          *,
          client:clients(*),
          items:invoice_items(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database query error:', error)
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Failed to fetch invoices',
          error: 'Database query failed'
        }, { status: 500 })
      }

      invoices = data || []
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Invoices retrieved successfully',
      data: invoices
    })

  } catch (error) {
    console.error('Invoices API error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    }, { status: 500 })
  }
}