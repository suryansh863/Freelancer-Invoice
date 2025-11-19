'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { InvoiceFormData, InvoiceItemData, Client } from '@/lib/validations'
import { calculateInvoiceTotals, formatCurrency } from '@/lib/calculations'

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string

  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<InvoiceFormData>({
    client_id: '',
    invoice_date: '',
    due_date: '',
    description: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    tax_rate: 18,
    tds_rate: 0,
    notes: '',
    upi_id: ''
  })
  const [tdsRateInput, setTdsRateInput] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totals, setTotals] = useState(calculateInvoiceTotals(formData.items, formData.tax_rate, formData.tds_rate))

  useEffect(() => {
    fetchClients()
    fetchInvoice()
  }, [invoiceId])

  useEffect(() => {
    const selectedClient = clients.find(c => c.id === formData.client_id)
    const clientType = selectedClient?.client_type || 'individual'
    const newTotals = calculateInvoiceTotals(formData.items, formData.tax_rate, formData.tds_rate, clientType, false)
    setTotals(newTotals)
  }, [formData.items, formData.tax_rate, formData.tds_rate, formData.client_id, clients])

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        const invoice = result.data
        setFormData({
          client_id: invoice.client_id,
          invoice_date: invoice.invoice_date,
          due_date: invoice.due_date || '',
          description: invoice.description || '',
          items: invoice.items || [{ description: '', quantity: 1, rate: 0, amount: 0 }],
          tax_rate: invoice.tax_rate,
          tds_rate: invoice.tds_rate,
          notes: invoice.notes || '',
          upi_id: invoice.upi_id || ''
        })
        setTdsRateInput(invoice.tds_rate > 0 ? invoice.tds_rate.toString() : '')
      } else {
        setError('Invoice not found')
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error)
      setError('Failed to load invoice')
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const result = await response.json()
      if (result.success) {
        setClients(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tax_rate' || name === 'tds_rate' ? parseFloat(value) || 0 : value
    }))
    
    if (error) setError(null)
  }

  const handleItemChange = (index: number, field: keyof InvoiceItemData, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = {
      ...newItems[index],
      [field]: value
    }
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }
    
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/dashboard/invoices/${invoiceId}`)
      } else {
        setError(result.error || result.message)
      }
    } catch (error) {
      console.error('Submission error:', error)
      setError('Failed to update invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    )
  }

  if (error && !formData.client_id) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Link href="/dashboard/invoices" className="text-blue-600 dark:text-blue-400 hover:underline">
          Back to Invoices
        </Link>
      </div>
    )
  }

  const selectedClient = clients.find(c => c.id === formData.client_id)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href={`/dashboard/invoices/${invoiceId}`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Invoice</h1>
          <p className="text-gray-600 dark:text-gray-400">Update invoice details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Client Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Client *
              </label>
              <select
                id="client_id"
                name="client_id"
                value={formData.client_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.company && `- ${client.company}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="invoice_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Invoice Date *
              </label>
              <input
                type="date"
                id="invoice_date"
                name="invoice_date"
                value={formData.invoice_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Invoice Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Service or product description"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Qty *
                  </label>
                  <input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      handleItemChange(index, 'quantity', val === '' ? 0 : parseFloat(val))
                    }}
                    placeholder="1"
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rate (₹) *
                  </label>
                  <input
                    type="number"
                    value={item.rate || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      handleItemChange(index, 'rate', val === '' ? 0 : parseFloat(val))
                    }}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(item.amount)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                  />
                </div>

                <div className="md:col-span-1 flex items-end">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tax Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tax_rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GST Rate (%)
              </label>
              <select
                id="tax_rate"
                name="tax_rate"
                value={formData.tax_rate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="0">0% (No GST)</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </select>
            </div>

            <div>
              <label htmlFor="tds_rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                TDS Rate (%)
                {selectedClient && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    (Suggested: {selectedClient.client_type === 'individual' ? '1%' : '2%'})
                  </span>
                )}
              </label>
              <input
                type="number"
                id="tds_rate"
                name="tds_rate"
                value={tdsRateInput}
                onChange={(e) => {
                  const value = e.target.value
                  setTdsRateInput(value)
                  setFormData(prev => ({
                    ...prev,
                    tds_rate: parseFloat(value) || 0
                  }))
                }}
                onFocus={(e) => {
                  if (e.target.value === '0') {
                    setTdsRateInput('')
                  }
                }}
                placeholder="0"
                min="0"
                max="30"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Details</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="upi_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                UPI ID (for payment link)
              </label>
              <input
                type="text"
                id="upi_id"
                name="upi_id"
                value={formData.upi_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="yourname@upi"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Payment terms, additional information..."
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.taxAmount > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">CGST ({totals.cgstRate}%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totals.cgstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">SGST ({totals.sgstRate}%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totals.sgstAmount)}</span>
                </div>
              </>
            )}
            {totals.tdsAmount > 0 && (
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>TDS ({totals.tdsRate}%):</span>
                <span className="font-medium">-{formatCurrency(totals.tdsAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-700">
              <span className="font-semibold text-gray-900 dark:text-white">Total Amount:</span>
              <span className="font-bold text-xl text-blue-600 dark:text-blue-400">{formatCurrency(totals.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href={`/dashboard/invoices/${invoiceId}`}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Updating...' : 'Update Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}
