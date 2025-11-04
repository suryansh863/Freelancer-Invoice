import { InvoiceItemData, Client } from './validations'

// GST rates for different services (in percentage)
export const GST_RATES = {
  STANDARD: 18,
  REDUCED: 12,
  ZERO: 0
}

// TDS rates based on client type and income (in percentage)
export const TDS_RATES = {
  INDIVIDUAL: {
    BELOW_50K: 0,
    ABOVE_50K: 1
  },
  COMPANY: {
    BELOW_30K: 0,
    ABOVE_30K: 2
  }
}

// Calculate TDS based on client type and amount
export function calculateTDS(amount: number, clientType: 'individual' | 'company', customRate?: number): number {
  if (customRate !== undefined) {
    return (amount * customRate) / 100
  }

  if (clientType === 'individual') {
    return amount >= 50000 ? (amount * TDS_RATES.INDIVIDUAL.ABOVE_50K) / 100 : 0
  } else {
    return amount >= 30000 ? (amount * TDS_RATES.COMPANY.ABOVE_30K) / 100 : 0
  }
}

// Calculate GST components (CGST, SGST, IGST)
export function calculateGST(amount: number, gstRate: number, isInterState: boolean = false) {
  const totalGST = (amount * gstRate) / 100

  if (isInterState) {
    // Inter-state: Only IGST
    return {
      cgst: 0,
      sgst: 0,
      igst: totalGST,
      total: totalGST
    }
  } else {
    // Intra-state: CGST + SGST (split equally)
    const cgst = totalGST / 2
    const sgst = totalGST / 2
    return {
      cgst,
      sgst,
      igst: 0,
      total: totalGST
    }
  }
}

// Calculate invoice totals
export function calculateInvoiceTotals(
  items: InvoiceItemData[],
  taxRate: number = 18,
  tdsRate: number = 0,
  clientType: 'individual' | 'company' = 'individual',
  isInterState: boolean = false
) {
  // Calculate subtotal from items
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

  // Calculate GST
  const gst = calculateGST(subtotal, taxRate, isInterState)

  // Calculate TDS
  const tdsAmount = calculateTDS(subtotal, clientType, tdsRate)

  // Calculate total
  const totalAmount = subtotal + gst.total - tdsAmount

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxRate,
    taxAmount: Math.round(gst.total * 100) / 100,
    cgstRate: taxRate / 2,
    cgstAmount: Math.round(gst.cgst * 100) / 100,
    sgstRate: taxRate / 2,
    sgstAmount: Math.round(gst.sgst * 100) / 100,
    igstRate: isInterState ? taxRate : 0,
    igstAmount: Math.round(gst.igst * 100) / 100,
    tdsRate,
    tdsAmount: Math.round(tdsAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100
  }
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount)
}

// Convert number to words (for invoice amount in words)
export function numberToWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function convertHundreds(num: number): string {
    let result = ''
    
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + ' Hundred '
      num %= 100
    }
    
    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + ' '
      num %= 10
    } else if (num >= 10) {
      result += teens[num - 10] + ' '
      return result
    }
    
    if (num > 0) {
      result += ones[num] + ' '
    }
    
    return result
  }

  if (amount === 0) return 'Zero Rupees Only'

  const crores = Math.floor(amount / 10000000)
  const lakhs = Math.floor((amount % 10000000) / 100000)
  const thousands = Math.floor((amount % 100000) / 1000)
  const hundreds = amount % 1000
  const paise = Math.round((amount % 1) * 100)

  let result = ''

  if (crores > 0) {
    result += convertHundreds(crores) + 'Crore '
  }
  
  if (lakhs > 0) {
    result += convertHundreds(lakhs) + 'Lakh '
  }
  
  if (thousands > 0) {
    result += convertHundreds(thousands) + 'Thousand '
  }
  
  if (hundreds > 0) {
    result += convertHundreds(hundreds)
  }

  result += 'Rupees'

  if (paise > 0) {
    result += ' and ' + convertHundreds(paise) + 'Paise'
  }

  result += ' Only'

  return result.trim()
}

// Generate UPI payment link
export function generateUPILink(
  upiId: string,
  amount: number,
  invoiceNumber: string,
  payeeName: string
): string {
  const params = new URLSearchParams({
    pa: upiId, // Payee address
    pn: payeeName, // Payee name
    am: amount.toString(), // Amount
    cu: 'INR', // Currency
    tn: `Payment for Invoice ${invoiceNumber}` // Transaction note
  })

  return `upi://pay?${params.toString()}`
}

// Validate GSTIN format
export function validateGSTIN(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstinRegex.test(gstin)
}

// Validate PAN format
export function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan)
}

// Calculate due date based on payment terms
export function calculateDueDate(invoiceDate: string, paymentTerms: number = 30): string {
  const date = new Date(invoiceDate)
  date.setDate(date.getDate() + paymentTerms)
  return date.toISOString().split('T')[0]
}

// Check if invoice is overdue
export function isInvoiceOverdue(dueDate: string, status: string): boolean {
  if (status === 'paid') return false
  const today = new Date()
  const due = new Date(dueDate)
  return due < today
}