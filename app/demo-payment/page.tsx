'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DemoPaymentPage() {
    const router = useRouter()
  const [processing, setProcessing] = useState(false)

  const invoiceId = searchParams.get('invoice')
  const amount = searchParams.get('amount')

  const handleDemoPayment = () => {
    setProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      router.push(`/payment-success?invoice=${invoiceId}`)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Demo Payment</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This is a demo payment page. Razorpay is not configured.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-400 mb-1">Demo Mode</h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                To enable real payments, configure Razorpay API keys in your environment variables.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 dark:text-gray-400">Amount to Pay:</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{amount ? (parseInt(amount) / 100).toLocaleString('en-IN') : '0'}
            </span>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invoice ID: <span className="font-mono text-gray-900 dark:text-white">{invoiceId}</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDemoPayment}
            disabled={processing}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Simulate Payment'
            )}
          </button>

          <Link
            href={`/dashboard/invoices/${invoiceId}`}
            className="block w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">To enable real payments:</h3>
          <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
            <li>Sign up for a Razorpay account at razorpay.com</li>
            <li>Get your API Key ID and Secret from the dashboard</li>
            <li>Add them to your .env.local file:
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id{'\n'}
                RAZORPAY_KEY_SECRET=your_key_secret
              </pre>
            </li>
            <li>Restart your development server</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
