'use client'

import React from 'react'

interface InvoiceTemplateProps {
  templateId: string
  invoice: any
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
  hasWatermark?: boolean
}

export default function InvoiceTemplate({ 
  templateId, 
  invoice, 
  colors = { primary: '#000000', secondary: '#666666', accent: '#999999' },
  hasWatermark = false 
}: InvoiceTemplateProps) {
  
  const renderBasicTemplate = () => (
    <div className="bg-white p-8 relative">
      {hasWatermark && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <span className="text-6xl font-bold text-gray-400 rotate-45">FREE PLAN</span>
        </div>
      )}
      
      <div className="border-2 border-gray-300 p-8">
        <h1 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>INVOICE</h1>
        {/* Basic black and white design */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Invoice Number:</p>
              <p>{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Date:</p>
              <p>{invoice.invoice_date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfessionalTemplate = () => (
    <div className="bg-white p-8 shadow-2xl">
      <div 
        className="rounded-t-2xl p-8 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` 
        }}
      >
        <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
        <p className="text-xl opacity-90">{invoice.invoice_number}</p>
      </div>
      
      <div className="p-8 border-2 border-gray-100 rounded-b-2xl">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: colors.primary }}>From:</h3>
            <p className="text-gray-700">{invoice.from_name}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: colors.primary }}>To:</h3>
            <p className="text-gray-700">{invoice.client_name}</p>
          </div>
        </div>
        
        <div 
          className="h-1 rounded-full mb-6"
          style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` }}
        />
        
        {/* Professional colorful design with gradients */}
      </div>
    </div>
  )

  const renderBusinessTemplate = () => (
    <div className="bg-gradient-to-br from-gray-50 to-white p-8 shadow-2xl">
      <div className="border-4 rounded-xl overflow-hidden" style={{ borderColor: colors.primary }}>
        <div 
          className="p-10 text-white relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)` 
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-3">INVOICE</h1>
            <p className="text-2xl opacity-90">{invoice.invoice_number}</p>
          </div>
        </div>
        
        <div className="p-10 bg-white">
          {/* Premium business design with luxury styling */}
          <div className="grid grid-cols-2 gap-10 mb-10">
            <div className="space-y-2">
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>From:</h3>
              <p className="text-gray-800 font-medium">{invoice.from_name}</p>
            </div>
            <div className="space-y-2 text-right">
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>To:</h3>
              <p className="text-gray-800 font-medium">{invoice.client_name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render based on template ID
  if (templateId === 'basic') {
    return renderBasicTemplate()
  } else if (templateId.startsWith('professional-')) {
    return renderProfessionalTemplate()
  } else if (templateId.startsWith('business-')) {
    return renderBusinessTemplate()
  }

  return renderBasicTemplate()
}
