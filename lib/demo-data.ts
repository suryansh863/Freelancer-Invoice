// Demo data for development mode
import type { Client, Invoice } from './validations'

// In-memory storage for demo purposes
let demoClients: Client[] = [
  {
    id: 'demo-client-1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+91 98765 43210',
    company: 'Acme Corporation Pvt Ltd',
    address: 'Plot No. 123, Sector 15\nGurgaon, Haryana 122001\nIndia',
    gstin: '06AAAAA0000A1Z5',
    pan: 'AAAAA0000A',
    client_type: 'company',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString()
  },
  {
    id: 'demo-client-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 87654 32109',
    company: '',
    address: 'Flat 4B, Green Valley Apartments\nBandra West, Mumbai 400050\nIndia',
    gstin: '',
    pan: 'BBBBB1111B',
    client_type: 'individual',
    created_at: new Date('2024-02-01').toISOString(),
    updated_at: new Date('2024-02-01').toISOString()
  }
]

let demoInvoices: Invoice[] = [
  {
    id: 'demo-invoice-1',
    invoice_number: 'INV-001',
    client_id: 'demo-client-1',
    invoice_date: '2024-11-01',
    due_date: '2024-12-01',
    status: 'sent',
    description: 'Website development and design services',
    amount: 50000,
    tax_rate: 18,
    tax_amount: 9000,
    tds_rate: 2,
    tds_amount: 1000,
    total_amount: 58000,
    cgst_rate: 9,
    cgst_amount: 4500,
    sgst_rate: 9,
    sgst_amount: 4500,
    igst_rate: 0,
    igst_amount: 0,
    payment_method: 'UPI',
    payment_status: 'pending',
    paid_amount: 0,
    upi_id: 'freelancer@paytm',
    notes: 'Payment due within 30 days. Late payment charges applicable.',
    items: [
      {
        id: 'item-1',
        invoice_id: 'demo-invoice-1',
        description: 'Website Design & Development',
        quantity: 1,
        rate: 40000,
        amount: 40000,
        created_at: new Date('2024-11-01').toISOString()
      },
      {
        id: 'item-2',
        invoice_id: 'demo-invoice-1',
        description: 'SEO Optimization',
        quantity: 1,
        rate: 10000,
        amount: 10000,
        created_at: new Date('2024-11-01').toISOString()
      }
    ],
    created_at: new Date('2024-11-01').toISOString(),
    updated_at: new Date('2024-11-01').toISOString()
  },
  {
    id: 'demo-invoice-2',
    invoice_number: 'INV-002',
    client_id: 'demo-client-2',
    invoice_date: '2024-11-05',
    due_date: '2024-12-05',
    status: 'draft',
    description: 'Content writing services',
    amount: 15000,
    tax_rate: 18,
    tax_amount: 2700,
    tds_rate: 1,
    tds_amount: 150,
    total_amount: 17550,
    cgst_rate: 9,
    cgst_amount: 1350,
    sgst_rate: 9,
    sgst_amount: 1350,
    igst_rate: 0,
    igst_amount: 0,
    payment_method: 'Bank Transfer',
    payment_status: 'paid',
    paid_amount: 17550,
    payment_date: '2024-11-10',
    notes: 'Thank you for the prompt payment!',
    items: [
      {
        id: 'item-3',
        invoice_id: 'demo-invoice-2',
        description: 'Blog Articles (5 articles)',
        quantity: 5,
        rate: 3000,
        amount: 15000,
        created_at: new Date('2024-11-05').toISOString()
      }
    ],
    created_at: new Date('2024-11-05').toISOString(),
    updated_at: new Date('2024-11-05').toISOString()
  }
]

// Add client references to invoices
demoInvoices = demoInvoices.map(invoice => ({
  ...invoice,
  client: demoClients.find(client => client.id === invoice.client_id)
}))

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