'use client'

import React, { useState, useEffect } from 'react'
import { Invoice } from '@/lib/validations'
import { formatCurrency } from '@/lib/calculations'

interface ReportData {
  totalRevenue: number
  totalInvoices: number
  paidInvoices: number
  pendingAmount: number
  monthlyData: Array<{
    month: string
    revenue: number
    invoices: number
  }>
  clientData: Array<{
    clientName: string
    totalAmount: number
    invoiceCount: number
  }>
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingAmount: 0,
    monthlyData: [],
    clientData: []
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('all')

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    try {
      const response = await fetch('/api/invoices')
      const result = await response.json()

      if (result.success) {
        const invoices: Invoice[] = result.data
        
        // Filter by date range if needed
        let filteredInvoices = invoices
        if (dateRange !== 'all') {
          const now = new Date()
          const filterDate = new Date()
          
          switch (dateRange) {
            case '30days':
              filterDate.setDate(now.getDate() - 30)
              break
            case '90days':
              filterDate.setDate(now.getDate() - 90)
              break
            case 'year':
              filterDate.setFullYear(now.getFullYear() - 1)
              break
          }
          
          filteredInvoices = invoices.filter(inv => 
            new Date(inv.invoice_date) >= filterDate
          )
        }

        // Calculate basic metrics
        const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total_amount, 0)
        const totalInvoices = filteredInvoices.length
        const paidInvoices = filteredInvoices.filter(inv => inv.payment_status === 'paid').length
        const pendingAmount = filteredInvoices
          .filter(inv => inv.payment_status !== 'paid')
          .reduce((sum, inv) => sum + inv.total_amount, 0)

        // Monthly data (last 6 months)
        const monthlyData = []
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          
          const monthInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.invoice_date)
            return invDate >= monthStart && invDate <= monthEnd
          })
          
          monthlyData.push({
            month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            revenue: monthInvoices.reduce((sum, inv) => sum + inv.total_amount, 0),
            invoices: monthInvoices.length
          })
        }

        // Client data
        const clientMap = new Map()
        filteredInvoices.forEach(inv => {
          const clientName = inv.client?.name || 'Unknown Client'
          if (clientMap.has(clientName)) {
            const existing = clientMap.get(clientName)
            clientMap.set(clientName, {
              totalAmount: existing.totalAmount + inv.total_amount,
              invoiceCount: existing.invoiceCount + 1
            })
          } else {
            clientMap.set(clientName, {
              totalAmount: inv.total_amount,
              invoiceCount: 1
            })
          }
        })

        const clientData = Array.from(clientMap.entries())
          .map(([clientName, data]) => ({
            clientName,
            ...data
          }))
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .slice(0, 10) // Top 10 clients

        setReportData({
          totalRevenue,
          totalInvoices,
          paidInvoices,
          pendingAmount,
          monthlyData,
          clientData
        })
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Payment Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.totalInvoices > 0 
                  ? Math.round((reportData.paidInvoices / reportData.totalInvoices) * 100)
                  : 0
                }%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.pendingAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Revenue Trend</h3>
        <div className="space-y-4">
          {reportData.monthlyData.map((month, index) => {
            const maxRevenue = Math.max(...reportData.monthlyData.map(m => m.revenue))
            const width = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0
            
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-gray-600">{month.month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className="bg-blue-600 h-6 rounded-full transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {formatCurrency(month.revenue)}
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">{month.invoices} inv</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Clients */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Top Clients by Revenue</h3>
        {reportData.clientData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No client data available</p>
        ) : (
          <div className="space-y-4">
            {reportData.clientData.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.clientName}</p>
                    <p className="text-sm text-gray-500">{client.invoiceCount} invoices</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(client.totalAmount)}</p>
                  <p className="text-sm text-gray-500">
                    Avg: {formatCurrency(client.totalAmount / client.invoiceCount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-blue-900 mb-1">Export Reports</h4>
            <p className="text-blue-800">Download your business data for accounting and tax purposes</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}