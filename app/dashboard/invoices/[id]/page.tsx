'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Invoice } from '@/lib/validations'
import { formatCurrency, numberToWords, generateUPILink } from '@/lib/calculations'
import PaymentButton from '@/app/components/PaymentButton'

export default function InvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice()
    }
  }, [invoiceId])

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`)
      const result = await response.json()

      if (result.success) {
        setInvoice(result.data)
      } else {
        setError(result.message || 'Failed to fetch invoice')
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error)
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getInvoiceStatus = (invoice: Invoice) => {
    if (invoice.payment_status === 'paid') return 'paid'
    if (invoice.payment_status === 'partial') return 'partial'
    if (invoice.due_date && new Date(invoice.due_date) < new Date()) return 'overdue'
    if (invoice.status === 'sent') return 'sent'
    return invoice.status
  }

  const handlePrint = () => {
    window.print()
  }

  const generatePaymentLink = () => {
    if (!invoice?.upi_id) return ''
    return generateUPILink(
      invoice.upi_id,
      invoice.total_amount,
      invoice.invoice_number,
      'Freelance Invoice Tracker'
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Not Found</h3>
        <p className="text-gray-600 mb-4">{error || 'The requested invoice could not be found.'}</p>
        <Link
          href="/dashboard/invoices"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Invoices
        </Link>
      </div>
    )
  }

  const status = getInvoiceStatus(invoice)
  const paymentLink = generatePaymentLink()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/invoices"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors print:hidden"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{invoice.invoice_number}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                {status}
              </span>
              <span className="text-gray-600">
                Created on {new Date(invoice.invoice_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 print:hidden">
          {status !== 'paid' && (
            <Link
              href={`/dashboard/invoices/${invoice.id}/edit`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Edit
            </Link>
          )}
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Print
          </button>
          {paymentLink && (
            <a
              href={paymentLink}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Pay Now
            </a>
          )}
        </div>
      </div>

      {/* Invoice */}
      <div className="bg-white rounded-xl shadow-sm border print:shadow-none print:border-none">
        <div className="p-8 print:p-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2">💰 Freelance Invoice Tracker</h2>
              <p className="text-gray-600">Professional Invoicing for Indian Freelancers</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-gray-900 mb-2">INVOICE</h3>
              <p className="text-gray-600">#{invoice.invoice_number}</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Bill To:</h4>
              <div className="text-gray-700">
                <p className="font-medium">{invoice.client?.name}</p>
                {invoice.client?.company && <p>{invoice.client.company}</p>}
                {invoice.client?.email && <p>{invoice.client.email}</p>}
                {invoice.client?.phone && <p>{invoice.client.phone}</p>}
                {invoice.client?.address && (
                  <div className="mt-2 whitespace-pre-line">{invoice.client.address}</div>
                )}
                {invoice.client?.gstin && (
                  <p className="mt-2"><strong>GSTIN:</strong> {invoice.client.gstin}</p>
                )}
                {invoice.client?.pan && (
                  <p><strong>PAN:</strong> {invoice.client.pan}</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Invoice Details:</h4>
              <div className="text-gray-700 space-y-1">
                <p><strong>Invoice Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                {invoice.due_date && (
                  <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>
                )}
                <p><strong>Payment Status:</strong> 
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </p>
                {invoice.description && (
                  <div className="mt-3">
                    <strong>Description:</strong>
                    <p className="mt-1">{invoice.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Description</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900">Qty</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">Rate</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-2 text-gray-700">{item.description}</td>
                      <td className="py-3 px-2 text-center text-gray-700">{item.quantity}</td>
                      <td className="py-3 px-2 text-right text-gray-700">{formatCurrency(item.rate)}</td>
                      <td className="py-3 px-2 text-right text-gray-700">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                </div>
                
                {invoice.cgst_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">CGST ({invoice.cgst_rate}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.cgst_amount)}</span>
                  </div>
                )}
                
                {invoice.sgst_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">SGST ({invoice.sgst_rate}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.sgst_amount)}</span>
                  </div>
                )}
                
                {invoice.igst_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">IGST ({invoice.igst_rate}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.igst_amount)}</span>
                  </div>
                )}
                
                {invoice.tds_amount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>TDS ({invoice.tds_rate}%):</span>
                    <span className="font-medium">-{formatCurrency(invoice.tds_amount)}</span>
                  </div>
                )}
                
                <div className="border-t-2 border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(invoice.total_amount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Amount in Words:</p>
                <p className="text-sm text-gray-800">{numberToWords(invoice.total_amount)}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {invoice.upi_id && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Payment Information</h4>
              <p className="text-gray-700 mb-2">UPI ID: <strong>{invoice.upi_id}</strong></p>
              {paymentLink && (
                <div className="print:hidden">
                  <a
                    href={paymentLink}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Pay via UPI
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
            <p>Thank you for your business!</p>
            <p className="mt-1">Generated by Freelance Invoice Tracker - Built for Indian Freelancers</p>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="print:hidden">
        <PaymentButton invoice={invoice} onPaymentSuccess={fetchInvoice} />
      </div>
    </div>
  )
}