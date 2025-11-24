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
    // Show coming soon message
    alert('🚀 Payment Integration Coming Soon!\n\nOnline payment processing will be available soon. For now, you can:\n\n• Share invoice with clients\n• Accept payments via UPI/Bank Transfer\n• Mark invoices as paid manually')
    return
    
    /* Payment integration code - will be enabled soon
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
          amount: Math.round(invoice.total_amount * 100),
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
        window.open(result.data.short_url, '_blank')
        
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
    */
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
          {/* Razorpay Payment - All Methods */}
          <button
            onClick={createPaymentLink}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                Pay with Razorpay
              </>
            )}
          </button>

          {/* Payment Methods Info */}
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              💳 Cards
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              📱 UPI
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              🏦 Net Banking
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
              💰 Wallets
            </span>
          </div>

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
