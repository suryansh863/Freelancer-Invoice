'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      features: [
        '5 invoices per month',
        '3 clients',
        'GST & TDS calculation',
        'Basic invoice templates',
        'Email support',
        'Mobile app access',
      ],
      limitations: [
        'No payment integration',
        'Basic reporting',
        'Watermark on invoices',
      ],
      cta: 'Get Started Free',
      popular: false,
      color: 'gray'
    },
    {
      name: 'Professional',
      description: 'For growing freelancers',
      price: { monthly: 299, yearly: 2990 },
      features: [
        'Unlimited invoices',
        'Unlimited clients',
        'GST & TDS calculation',
        'Professional templates',
        'Razorpay payment integration',
        'UPI payment links',
        'Advanced reporting',
        'Priority email support',
        'No watermarks',
        'Custom branding',
        'Recurring invoices',
        'Payment reminders',
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true,
      color: 'blue'
    },
    {
      name: 'Business',
      description: 'For teams and agencies',
      price: { monthly: 999, yearly: 9990 },
      features: [
        'Everything in Professional',
        'Multi-user access (5 users)',
        'Team collaboration',
        'Advanced analytics',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support',
        'White-label option',
        'Custom domain',
        'Bulk operations',
        'Export to Tally/QuickBooks',
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      color: 'purple'
    }
  ]

  const addons = [
    {
      name: 'Additional Users',
      price: 199,
      description: 'Add more team members',
      icon: '👥'
    },
    {
      name: 'SMS Notifications',
      price: 99,
      description: 'Send SMS payment reminders',
      icon: '📱'
    },
    {
      name: 'WhatsApp Integration',
      price: 149,
      description: 'Send invoices via WhatsApp',
      icon: '💬'
    },
    {
      name: 'Priority Support',
      price: 299,
      description: '24/7 dedicated support',
      icon: '🎯'
    }
  ]

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the charges.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets through Razorpay.'
    },
    {
      question: 'Are there any hidden charges?',
      answer: 'No hidden charges! The price you see is what you pay. Razorpay charges 2% transaction fee on payments received.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription anytime. You\'ll continue to have access until the end of your billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment, no questions asked.'
    }
  ]

  const getColorClasses = (color: string, popular: boolean) => {
    if (popular) {
      return {
        border: 'border-blue-500 dark:border-blue-400',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        badge: 'bg-blue-600 text-white',
        button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
      }
    }
    return {
      border: 'border-gray-200 dark:border-gray-700',
      bg: 'bg-white dark:bg-gray-800',
      badge: 'bg-gray-600 text-white',
      button: 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              💰 Invoice Tracker
            </h1>
          </Link>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Choose the perfect plan for your business. Start free, upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const colors = getColorClasses(plan.color, plan.popular)
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly
            const displayPrice = billingCycle === 'yearly' ? Math.round(price / 12) : price

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 ${colors.border} ${colors.bg} p-8 shadow-xl hover:shadow-2xl transition-all ${
                  plan.popular ? 'scale-105 z-10' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`${colors.badge} px-4 py-1 rounded-full text-sm font-semibold`}>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      ₹{displayPrice}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      /month
                    </span>
                  </div>
                  {billingCycle === 'yearly' && price > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Billed ₹{price} annually
                    </p>
                  )}
                </div>

                <Link
                  href={plan.name === 'Free' ? '/auth/signup' : '/auth/signup'}
                  className={`block w-full py-3 px-6 rounded-lg font-semibold text-center ${colors.button} transition-all mb-6`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start opacity-60">
                      <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Optional Add-ons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-3">{addon.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {addon.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {addon.description}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{addon.price}/mo
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16 overflow-x-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Feature Comparison
          </h3>
          <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Feature</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Free</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Professional</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Invoices per month</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">5</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Unlimited</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Clients</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">3</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Unlimited</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Payment Integration</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">✅</td>
                <td className="px-6 py-4 text-center">✅</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Team Members</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">1</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">1</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">5</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">API Access</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">✅</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Support</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Email</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Priority Email</td>
                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">24/7 Phone</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h3>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  {faq.question}
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl p-12 text-center shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of freelancers managing their invoices professionally
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-x-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Home
          </Link>
          <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
