import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { invoiceSchema, type ApiResponse, type InvoiceFormData } from '@/lib/validations'
import { calculateInvoiceTotals } from '@/lib/calculations'
import { shouldUseFallback } from '@/lib/fallback-storage'

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
      // Use fallback storage for development
      console.log('Using fallback storage for invoices')
      
      try {
        const fs = require('fs')
        const path = require('path')
        const invoicesFile = path.join(process.cwd(), 'data', 'invoices.json')
        const itemsFile = path.join(process.cwd(), 'data', 'invoice_items.json')
        
        // Ensure data directory exists
        const dataDir = path.dirname(invoicesFile)
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true })
        }

        // Read existing data
        let invoices = []
        let invoiceItems = []
        
        if (fs.existsSync(invoicesFile)) {
          invoices = JSON.parse(fs.readFileSync(invoicesFile, 'utf-8'))
        }
        if (fs.existsSync(itemsFile)) {
          invoiceItems = JSON.parse(fs.readFileSync(itemsFile, 'utf-8'))
        }

        // Generate invoice number
        const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`

        // Create new invoice
        const invoiceId = Date.now().toString(36) + Math.random().toString(36).substr(2)
        
        newInvoice = {
          id: invoiceId,
          invoice_number: invoiceNumber,
          client_id,
          ...invoiceData,
          status: 'draft',
          amount: totals.subtotal,
          ...totals,
          payment_status: 'pending',
          paid_amount: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Create invoice items
        const newItems = items.map(item => ({
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          invoice_id: invoiceId,
          ...item,
          created_at: new Date().toISOString()
        }))

        invoices.push(newInvoice)
        invoiceItems.push(...newItems)

        fs.writeFileSync(invoicesFile, JSON.stringify(invoices, null, 2))
        fs.writeFileSync(itemsFile, JSON.stringify(invoiceItems, null, 2))

        newInvoice.items = newItems
      } catch (error) {
        console.error('Fallback storage error:', error)
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
      // Use fallback storage
      try {
        const fs = require('fs')
        const path = require('path')
        const invoicesFile = path.join(process.cwd(), 'data', 'invoices.json')
        const itemsFile = path.join(process.cwd(), 'data', 'invoice_items.json')
        const clientsFile = path.join(process.cwd(), 'data', 'clients.json')
        
        let invoicesData = []
        let itemsData = []
        let clientsData = []

        if (fs.existsSync(invoicesFile)) {
          invoicesData = JSON.parse(fs.readFileSync(invoicesFile, 'utf-8'))
        }
        if (fs.existsSync(itemsFile)) {
          itemsData = JSON.parse(fs.readFileSync(itemsFile, 'utf-8'))
        }
        if (fs.existsSync(clientsFile)) {
          clientsData = JSON.parse(fs.readFileSync(clientsFile, 'utf-8'))
        }

        // Join data
        invoices = invoicesData.map(invoice => ({
          ...invoice,
          client: clientsData.find(client => client.id === invoice.client_id),
          items: itemsData.filter(item => item.invoice_id === invoice.id)
        }))

        // Sort by created_at desc
        invoices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      } catch (error) {
        console.error('Fallback storage error:', error)
        invoices = []
      }
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