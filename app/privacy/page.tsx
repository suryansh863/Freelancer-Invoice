'use client'

import React from 'react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h2>
          <p className="text-gray-600 dark:text-gray-400">Last Updated: November 22, 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to Freelance Invoice Tracker. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2.1 Personal Information</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  When you register for an account, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Business name (optional)</li>
                  <li>Business address</li>
                  <li>PAN (Permanent Account Number)</li>
                  <li>GSTIN (Goods and Services Tax Identification Number) - optional</li>
                  <li>Password (encrypted)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2.2 Business Data</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  When you use our Service, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>Client information (names, contact details, tax information)</li>
                  <li>Invoice details (amounts, dates, descriptions)</li>
                  <li>Payment information (UPI IDs, payment status)</li>
                  <li>Transaction records</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2.3 Technical Information</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  We automatically collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Usage data (pages visited, time spent)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              We use the collected information for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Service Provision:</strong> To provide, maintain, and improve our invoicing services</li>
              <li><strong>Account Management:</strong> To create and manage your account</li>
              <li><strong>Communication:</strong> To send you updates, notifications, and support messages</li>
              <li><strong>Payment Processing:</strong> To facilitate payment transactions through Razorpay</li>
              <li><strong>Analytics:</strong> To understand how users interact with our Service</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activities</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Storage and Security</h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                <strong>4.1 Storage:</strong> Your data is stored securely using Supabase, a trusted cloud database provider. All data is encrypted in transit and at rest.
              </p>
              <p className="leading-relaxed">
                <strong>4.2 Security Measures:</strong> We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Password hashing using bcrypt</li>
                <li>HTTPS encryption for all data transmission</li>
                <li>Row-level security policies</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
              </ul>
              <p className="leading-relaxed">
                <strong>4.3 Data Retention:</strong> We retain your data for as long as your account is active or as needed to provide services. You can request deletion of your data at any time.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Data Sharing and Disclosure</h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Razorpay for payment processing, Supabase for data storage</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Third-Party Services</h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                <strong>6.1 Razorpay:</strong> Payment processing is handled by Razorpay. Their privacy policy governs the collection and use of payment information.
              </p>
              <p className="leading-relaxed">
                <strong>6.2 Supabase:</strong> Database services are provided by Supabase. They maintain their own privacy practices.
              </p>
              <p className="leading-relaxed">
                We are not responsible for the privacy practices of these third-party services.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Your Rights</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Under Indian data protection laws, you have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your data</li>
              <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              To exercise these rights, please contact us through your account settings or our support channels.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Cookies and Tracking</h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Maintain your session and keep you logged in</li>
                <li>Remember your preferences (theme, language)</li>
                <li>Analyze usage patterns and improve our Service</li>
                <li>Provide personalized content</li>
              </ul>
              <p className="leading-relaxed mt-3">
                You can control cookies through your browser settings. Note that disabling cookies may affect Service functionality.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Children's Privacy</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. International Data Transfers</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your data may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Data Breach Notification</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In the event of a data breach that affects your personal information, we will notify you and relevant authorities as required by law, typically within 72 hours of becoming aware of the breach.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Changes to Privacy Policy</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">13. Contact Us</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> privacy@invoicetracker.com<br />
                <strong>Address:</strong> India<br />
                <strong>Response Time:</strong> We aim to respond within 48 hours
              </p>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Your Privacy Matters:</strong> We are committed to protecting your privacy and handling your data responsibly. By using our Service, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Home
          </Link>
          <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </Link>
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
