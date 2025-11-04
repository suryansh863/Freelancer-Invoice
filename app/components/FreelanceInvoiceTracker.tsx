'use client'

import React, { useState } from 'react'

interface FormData {
  name: string
  email: string
  profession: string
}

interface SubmissionState {
  isSubmitting: boolean
  isSubmitted: boolean
  error: string | null
  successMessage: string | null
}

const FreelanceInvoiceTracker: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    profession: ''
  })
  
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    successMessage: null
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when user starts typing
    if (submissionState.error) {
      setSubmissionState(prev => ({ ...prev, error: null }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setSubmissionState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null,
      successMessage: null
    }))

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmissionState({
          isSubmitting: false,
          isSubmitted: true,
          error: null,
          successMessage: result.message
        })
        
        // Reset form after successful submission
        setFormData({ name: '', email: '', profession: '' })
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setSubmissionState(prev => ({
            ...prev,
            isSubmitted: false,
            successMessage: null
          }))
        }, 5000)
      } else {
        setSubmissionState({
          isSubmitting: false,
          isSubmitted: false,
          error: result.error || result.message,
          successMessage: null
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmissionState({
        isSubmitting: false,
        isSubmitted: false,
        error: 'Network error. Please check your connection and try again.',
        successMessage: null
      })
    }
  }

  const features = [
    {
      icon: '🧮',
      title: 'TDS Auto-Calculation',
      description: 'Automatic TDS calculations based on client type and income slab. Never worry about tax compliance again.'
    },
    {
      icon: '📄',
      title: 'Simple GST Invoicing',
      description: 'Professional, GST-compliant invoice templates. Add your GSTIN and generate invoices in seconds.'
    },
    {
      icon: '📱',
      title: 'UPI/Razorpay Payment Links',
      description: 'Generate UPI QR codes and Razorpay payment links. Get paid instantly via PhonePe, GPay, or Paytm.'
    },
    {
      icon: '🔔',
      title: 'Automated Payment Reminders',
      description: 'Automated payment reminders via email and WhatsApp. Never chase clients manually again.'
    },
    {
      icon: '📥',
      title: 'Downloadable Professional PDFs',
      description: 'Export invoices as PDFs for offline sharing, printing, or record keeping. Always have a backup.'
    },
    {
      icon: '👥',
      title: 'Client Database & Tracking',
      description: 'Store client details, track project history, and manage all your business relationships in one place.'
    },
    {
      icon: '📊',
      title: 'Monthly Income Summaries',
      description: 'Track your earnings, pending payments, and tax obligations. Perfect for ITR filing and business planning.'
    }
  ]

  const painPoints = [
    'No more confusing Excel sheets for invoice tracking',
    'No more manual GST and TDS calculations',
    'No more missed payments or forgotten follow-ups',
    'No more unprofessional invoice templates',
    'No more expensive tools like Zoho or FreshBooks'
  ]

  const faqs = [
    {
      question: 'Is Freelance Invoice Tracker free to use?',
      answer: 'We offer a 14-day free trial. After that, it\'s just ₹299/month - much more affordable than Zoho (₹1200+) or FreshBooks (₹1500+). No hidden fees, no per-invoice charges.'
    },
    {
      question: 'How is it better than Zoho or other tools?',
      answer: 'Unlike generic tools, we\'re built specifically for Indian freelancers. We handle TDS calculations, GST compliance, UPI payments, and Indian tax rules automatically. Plus, we\'re 4x cheaper than competitors.'
    },
    {
      question: 'Is it GST and TDS compliant?',
      answer: 'Absolutely! Our tool automatically calculates TDS based on client type (individual/company) and your income slab. It generates GST-compliant invoices with proper GSTIN formatting and supports Section 44ADA.'
    },
    {
      question: 'How are payments handled?',
      answer: 'We integrate with UPI (PhonePe, GPay, Paytm), Razorpay, and traditional bank transfers. Clients can pay instantly via QR codes or payment links. We don\'t handle money directly - it goes straight to your account.'
    },
    {
      question: 'How is my data stored and secured?',
      answer: 'We use bank-grade encryption, secure cloud storage on AWS, and never share your data with third parties. Your client information and financial data are completely safe and backed up automatically.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">💰 Freelance Invoice Tracker</div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/dashboard" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                🚀 Try Dashboard
              </a>
              <button 
                onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Built for <span className="text-blue-600">Indian freelancers</span>.
              <br />
              Simple, compliant invoicing & effortless payments.
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Stop juggling Excel sheets, WhatsApp messages, and confusing tax calculations. 
              Get paid faster with GST-compliant invoices, automatic TDS calculations, and UPI payment links.
            </p>

            {/* Social Proof Banner */}
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full mb-8">
              <span className="text-green-600 mr-2">✓</span>
              <span className="font-medium">100+ freelancers already signed up!</span>
            </div>

            {/* Waitlist Form */}
            <div id="waitlist-form" className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Join the Waitlist - Get Early Access</h3>
              
              {!submissionState.isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {submissionState.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">⚠️</span>
                        <span>{submissionState.error}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={submissionState.isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={submissionState.isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <select
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    required
                    disabled={submissionState.isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select your profession</option>
                    <option value="graphic-designer">Graphic Designer</option>
                    <option value="content-writer">Content Writer</option>
                    <option value="developer">Developer</option>
                    <option value="digital-marketer">Digital Marketer</option>
                    <option value="consultant">Consultant</option>
                    <option value="photographer">Photographer</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    type="submit"
                    disabled={submissionState.isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submissionState.isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      'Join Waitlist'
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl text-green-500 mb-4">✓</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome aboard!</h3>
                  <p className="text-gray-600 mb-4">{submissionState.successMessage}</p>
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    <p className="text-sm">
                      🎉 You're now on the waitlist! Check your email for a welcome message with exclusive early access details.
                    </p>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                🔒 No spam. Unsubscribe anytime. Launch expected in January 2025.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to get paid professionally
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for Indian freelancers with features that understand your workflow and compliance needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              No confusing Excel sheets or GST rules. No missed payments.
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We solve the biggest pain points that Indian freelancers face every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {painPoints.map((point, index) => (
              <div key={index} className="flex items-center bg-gray-800 p-4 rounded-lg">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span className="text-gray-200">{point}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold text-lg">
              All of this for just ₹299/month (vs ₹1200+ for Zoho)
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Freelance Invoice Tracker
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
            🚀 Try the Live Demo Now!
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            Experience the full invoice management system with realistic demo data. 
            No signup required - start exploring immediately!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Live Dashboard</h3>
              <p className="text-gray-600 text-sm">Real-time business metrics and analytics</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-bold text-gray-900 mb-2">Create Invoices</h3>
              <p className="text-gray-600 text-sm">GST-compliant invoices with TDS calculations</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">UPI Payments</h3>
              <p className="text-gray-600 text-sm">Generate payment links and QR codes</p>
            </div>
          </div>

          <a 
            href="/dashboard"
            className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Launch Dashboard Demo
          </a>
          
          <p className="text-sm text-gray-500 mt-4">
            ✨ Fully functional • No registration needed • Realistic Indian business data
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to get paid like a pro?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 100+ Indian freelancers who are already simplifying their invoicing and getting paid faster.
          </p>
          <button 
            onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Join the Waitlist Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">💰 Freelance Invoice Tracker</div>
            <p className="text-gray-400 mb-4">Built with ❤️ for Indian freelancers</p>
            <p className="text-sm text-gray-500">
              © 2025 Freelance Invoice Tracker. All rights reserved. | 
              <span className="ml-2">Privacy: We never share your data with third parties.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default FreelanceInvoiceTracker