'use client'

import React from 'react'
import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              💰 Invoice Tracker
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h2>
          <p className="text-gray-600 dark:text-gray-400">Last Updated: November 22, 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing and using Freelance Invoice Tracker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Description of Service</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Freelance Invoice Tracker provides a web-based platform for freelancers and small businesses to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Create and manage professional invoices</li>
              <li>Track clients and their information</li>
              <li>Calculate GST and TDS automatically</li>
              <li>Generate payment links via Razorpay</li>
              <li>Monitor payment status and generate reports</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Accounts</h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                <strong>3.1 Registration:</strong> You must provide accurate, current, and complete information during the registration process and keep your account information updated.
              </p>
              <p className="leading-relaxed">
                <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p className="leading-relaxed">
                <strong>3.3 Account Termination:</strong> We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent activities.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. User Responsibilities</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">You agree to:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Provide accurate business and tax information (PAN, GSTIN)</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to the Service</li>
              <li>Not use the Service to transmit malicious code or viruses</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Maintain accurate records of your invoices and transactions</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Payment Processing</h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                <strong>5.1 Third-Party Services:</strong> Payment processing is handled by Razorpay, a third-party payment gateway. By using payment features, you agree to Razorpay's terms and conditions.
              </p>
              <p className="leading-relaxed">
                <strong>5.2 Transaction Fees:</strong> Razorpay charges transaction fees as per their pricing. We are not responsible for these fees.
              </p>
              <p className="leading-relaxed">
                <strong>5.3 Payment Disputes:</strong> Any disputes regarding payments should be resolved directly with Razorpay and your clients.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Tax Compliance</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              While our Service provides GST and TDS calculations, you are solely responsible for ensuring compliance with Indian tax laws. We recommend consulting with a qualified tax professional for your specific situation. The Service is provided as a tool and does not constitute tax advice.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Intellectual Property</h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                <strong>7.1 Service Content:</strong> All content, features, and functionality of the Service are owned by Freelance Invoice Tracker and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="leading-relaxed">
                <strong>7.2 User Content:</strong> You retain all rights to the data you input into the Service (invoices, client information, etc.). By using the Service, you grant us a license to store and process this data to provide the Service.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Data Backup and Loss</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              While we take reasonable measures to protect your data, we recommend maintaining your own backups. We are not liable for any data loss, corruption, or unauthorized access to your account.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Limitation of Liability</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, FREELANCE INVOICE TRACKER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Disclaimer of Warranties</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Modifications to Service</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Changes to Terms</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms of Service on this page and updating the "Last Updated" date. Your continued use of the Service after such changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">13. Governing Law</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">14. Contact Information</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through the contact information provided on our website.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              By using Freelance Invoice Tracker, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Home
          </Link>
          <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
