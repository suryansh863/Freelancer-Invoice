'use client'

import React, { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import Link from 'next/link'

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

  const [scrollY, setScrollY] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showProfileMenu && !target.closest('.profile-dropdown')) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileMenu])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setShowProfileMenu(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (submissionState.error) {
      setSubmissionState(prev => ({ ...prev, error: null }))
    }
  }

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
        
        setFormData({ name: '', email: '', profession: '' })
        
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
      icon: '📄',
      title: 'GST-Compliant Invoices',
      description: 'Generate professional, tax-compliant invoices in seconds with automatic GST calculations.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💰',
      title: 'Auto TDS Calculator',
      description: 'Never worry about TDS calculations again. We handle it automatically based on client type.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📱',
      title: 'UPI Payment Links',
      description: 'Get paid faster with integrated UPI payment links directly in your invoices.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Track your income, pending payments, and business growth with beautiful dashboards.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🔔',
      title: 'Payment Reminders',
      description: 'Automated reminders for overdue invoices so you never miss a payment.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: '☁️',
      title: 'Cloud Storage',
      description: 'Access your invoices anywhere, anytime. All data securely stored in the cloud.',
      color: 'from-teal-500 to-cyan-500'
    }
  ]

  const stats = [
    { value: '500+', label: 'Freelancers' },
    { value: '₹10L+', label: 'Invoiced' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/30 dark:bg-pink-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 group">
              <div className="text-3xl transform group-hover:scale-110 transition-transform">💰</div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Invoice Tracker
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                <span className="hidden sm:inline">🚀 Try Demo</span>
                <span className="sm:hidden">Demo</span>
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">{user ? user.full_name || 'Profile' : 'Account'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name || 'User'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Sign Up
                        </Link>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Try Demo
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-full animate-bounce-slow">
              <span className="text-2xl">✨</span>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Built for Indian Freelancers
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block text-gray-900 dark:text-white animate-slide-up">
                Invoice Like a
              </span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-slide-up animation-delay-200">
                Professional
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up animation-delay-400">
              Stop juggling Excel sheets and WhatsApp messages. Create GST-compliant invoices, 
              calculate TDS automatically, and get paid faster with UPI links.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-600">
              <Link
                href="/dashboard"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Try Free Demo</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <button
                onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-2xl font-semibold text-lg hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl hover:scale-105 transition-all"
              >
                Join Waitlist
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 animate-slide-up animation-delay-800">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl rotate-12 opacity-20"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float animation-delay-2000">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features designed specifically for Indian freelancers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-1 rounded-3xl">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-4 border-white dark:border-gray-900 flex items-center justify-center text-white font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Join 500+ Happy Freelancers
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                "This tool saved me hours every week. The automatic TDS calculation alone is worth it!"
              </p>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Get Early Access
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Join the waitlist and be among the first to experience the future of invoicing
              </p>
            </div>

            {submissionState.isSubmitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  You're on the list!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {submissionState.successMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submissionState.error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl animate-shake">
                    {submissionState.error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profession *
                  </label>
                  <select
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select your profession</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="writer">Writer</option>
                    <option value="consultant">Consultant</option>
                    <option value="photographer">Photographer</option>
                    <option value="videographer">Videographer</option>
                    <option value="marketer">Marketer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submissionState.isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submissionState.isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining...
                    </span>
                  ) : (
                    'Join the Waitlist'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">💰</span>
            <span className="text-xl font-bold">Invoice Tracker</span>
          </div>
          <p className="text-gray-400 mb-6">
            Built with ❤️ for Indian Freelancers
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <span>•</span>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <span>•</span>
            <a href="#waitlist-form" className="hover:text-white transition-colors">Waitlist</a>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            © 2025 Invoice Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default FreelanceInvoiceTracker
