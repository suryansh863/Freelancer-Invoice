// Subscription and feature access utilities

export type SubscriptionPlan = 'free' | 'professional' | 'business'

export interface UserSubscription {
  plan: SubscriptionPlan
  status: 'active' | 'cancelled' | 'expired'
  expiresAt?: string
}

// Check if user has access to professional features
export function hasProfessionalAccess(plan: SubscriptionPlan): boolean {
  return plan === 'professional' || plan === 'business'
}

// Check if user has access to business features
export function hasBusinessAccess(plan: SubscriptionPlan): boolean {
  return plan === 'business'
}

// Get available invoice templates based on subscription
export function getAvailableTemplates(plan: SubscriptionPlan) {
  const templates = [
    {
      id: 'basic',
      name: 'Basic Template',
      description: 'Simple black and white invoice',
      preview: '/templates/basic-preview.png',
      isPremium: false,
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#999999'
      }
    }
  ]

  if (hasProfessionalAccess(plan)) {
    templates.push(
      {
        id: 'professional-blue',
        name: 'Professional Blue',
        description: 'Modern blue gradient design',
        preview: '/templates/pro-blue-preview.png',
        isPremium: true,
        colors: {
          primary: '#2563eb',
          secondary: '#3b82f6',
          accent: '#60a5fa'
        }
      },
      {
        id: 'professional-purple',
        name: 'Professional Purple',
        description: 'Elegant purple theme',
        preview: '/templates/pro-purple-preview.png',
        isPremium: true,
        colors: {
          primary: '#7c3aed',
          secondary: '#8b5cf6',
          accent: '#a78bfa'
        }
      },
      {
        id: 'professional-green',
        name: 'Professional Green',
        description: 'Fresh green design',
        preview: '/templates/pro-green-preview.png',
        isPremium: true,
        colors: {
          primary: '#059669',
          secondary: '#10b981',
          accent: '#34d399'
        }
      }
    )
  }

  if (hasBusinessAccess(plan)) {
    templates.push(
      {
        id: 'business-premium',
        name: 'Business Premium',
        description: 'Luxury gold and black theme',
        preview: '/templates/business-premium-preview.png',
        isPremium: true,
        colors: {
          primary: '#d97706',
          secondary: '#f59e0b',
          accent: '#fbbf24'
        }
      },
      {
        id: 'business-corporate',
        name: 'Business Corporate',
        description: 'Professional corporate design',
        preview: '/templates/business-corporate-preview.png',
        isPremium: true,
        colors: {
          primary: '#1e40af',
          secondary: '#1e3a8a',
          accent: '#3b82f6'
        }
      }
    )
  }

  return templates
}

// Get reporting features based on subscription
export function getReportingFeatures(plan: SubscriptionPlan) {
  const features = {
    basicReports: true,
    advancedAnalytics: hasProfessionalAccess(plan),
    customDateRanges: hasProfessionalAccess(plan),
    exportToPDF: true,
    exportToExcel: hasProfessionalAccess(plan),
    clientAnalytics: hasProfessionalAccess(plan),
    revenueForecasting: hasBusinessAccess(plan),
    taxReports: hasProfessionalAccess(plan),
    profitMargins: hasBusinessAccess(plan),
    customReports: hasBusinessAccess(plan)
  }

  return features
}

// Feature limits based on subscription
export function getFeatureLimits(plan: SubscriptionPlan) {
  switch (plan) {
    case 'free':
      return {
        maxInvoicesPerMonth: 5,
        maxClients: 3,
        maxTemplates: 1,
        canCustomizeBranding: false,
        hasWatermark: true
      }
    case 'professional':
      return {
        maxInvoicesPerMonth: Infinity,
        maxClients: Infinity,
        maxTemplates: 5,
        canCustomizeBranding: true,
        hasWatermark: false
      }
    case 'business':
      return {
        maxInvoicesPerMonth: Infinity,
        maxClients: Infinity,
        maxTemplates: Infinity,
        canCustomizeBranding: true,
        hasWatermark: false
      }
  }
}
