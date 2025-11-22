// Demo data for development mode
import type { Client, Invoice } from './validations'

// In-memory storage for development/demo purposes only
// In production, all data should be stored in Supabase
let demoClients: Client[] = []
let demoInvoices: Invoice[] = []

export const demoStorage = {
  // Clients
  getClients: (): Client[] => [...demoClients],
  
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Client => {
    const newClient: Client = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ...client,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    demoClients.push(newClient)
    return newClient
  },

  // Invoices
  getInvoices: (): Invoice[] => [...demoInvoices],
  
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at' | 'items'>, items: any[]): Invoice => {
    const invoiceNumber = `INV-${String(demoInvoices.length + 1).padStart(3, '0')}`
    const invoiceId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    
    const newInvoice: Invoice = {
      id: invoiceId,
      invoice_number: invoiceNumber,
      ...invoice,
      status: 'draft',
      payment_status: 'pending',
      paid_amount: 0,
      items: items.map(item => ({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        invoice_id: invoiceId,
        ...item,
        created_at: new Date().toISOString()
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Add client reference
    newInvoice.client = demoClients.find(client => client.id === newInvoice.client_id)
    
    demoInvoices.push(newInvoice)
    return newInvoice
  },

  getInvoiceById: (id: string): Invoice | undefined => {
    return demoInvoices.find(invoice => invoice.id === id)
  }
}