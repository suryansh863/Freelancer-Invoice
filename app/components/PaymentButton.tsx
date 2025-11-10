'use client'

import React, { useState } from 'react'
import type { Invoice } from '@/lib/validations'

interface PaymentButtonProps {
  invoice: Invoice
  onPaymentSuccess?: () => void
}

export default function PaymentButton({ invoice, onPaymentSuccess }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)

  const createPaymentLink = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          amount: Math.round(invoice.total_amount * 100), // Convert to paise
          currency: 'INR',
          description: `Payment for Invoice ${invoice.invoice_number}`,
          customer: {
            name: invoice.client?.name || 'Customer',
            email: invoice.client?.email || undefined,
            contact: invoice.client?.phone || undefined,
          },
          callbackUrl: `${window.location.origin}/payment-success?invoice=${invoice.id}`,
        }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        setPaymentLink(result.data.short_url)
        
        // Open payment link in new tab
        window.open(result.data.short_url, '_blank')
        
        // If demo mode, show message
        if (result.data.isDemoMode) {
          alert('Demo Mode: Razorpay is not configured. This is a demo payment link.')
        }
      } else {
        setError(result.error || result.message)
      }
    } catch (err) {
      console.error('Payment link error:', err)
      setError('Failed to create payment link')
    } finally {
      setIsLoading(false)
    }
  }

  const generateUpiLink = () => {
    if (!invoice.upi_id) {
      setError('UPI ID not configured for this invoice')
      return
    }

    const upiLink = `upi://pay?pa=${invoice.upi_id}&pn=${encodeURIComponent(invoice.client?.name || 'Freelancer')}&am=${invoice.total_amount}&cu=INR&tn=${encodeURIComponent(`Payment for ${invoice.invoice_number}`)}`
    
    // Try to open UPI link
    window.location.href = upiLink
    
    // Also copy to clipboard
    navigator.clipboard.writeText(upiLink).then(() => {
      alert('UPI link copied to clipboard!')
    })
  }

  if (invoice.payment_status === 'paid') {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center text-green-700 dark:text-green-400">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Payment Completed</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Payment Options
        </h3>
        
        <div className="space-y-3">
          {/* Razorpay Payment Link */}
          <button
            onClick={createPaymentLink}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Payment Link...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay with Razorpay (Card/UPI/Netbanking)
              </>
            )}
          </button>

          {/* Direct UPI Payment */}
          {invoice.upi_id && (
            <button
              onClick={generateUpiLink}
              className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              Pay via UPI ({invoice.upi_id})
            </button>
          )}

          {paymentLink && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Payment link created:</p>
              <a 
                href={paymentLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
              >
                {paymentLink}
              </a>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Amount to Pay:</span>
            <span className="font-bold text-gray-900 dark:text-white">₹{invoice.total_amount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
