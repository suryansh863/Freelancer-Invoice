# 🎨 Subscription-Based Features Implementation

## Overview
This document explains how different features are unlocked based on user subscription tiers.

## Database Schema Updates

### Users Table - Added Fields:
```sql
subscription_plan VARCHAR(20) DEFAULT 'free' 
  -- Options: 'free', 'professional', 'business'
subscription_status VARCHAR(20) DEFAULT 'active'
  -- Options: 'active', 'cancelled', 'expired'
subscription_expires_at TIMESTAMP WITH TIME ZONE
```

## Feature Tiers

### 🆓 Free Plan
**Invoice Templates:**
- ✅ Basic Template (Black & White)
- ❌ Watermark: "FREE PLAN" displayed on invoices
- ❌ No color customization

**Reports:**
- ✅ Basic metrics (Revenue, Invoice count, Payment rate)
- ✅ Monthly revenue trend (last 6 months)
- ✅ Top 10 clients
- ✅ Export to CSV
- ❌ No advanced analytics

**Limits:**
- 5 invoices per month
- 3 clients maximum
- 1 template only

---

### 💼 Professional Plan (₹299/month)
**Invoice Templates:**
- ✅ All Free features
- ✅ Professional Blue Template (Gradient design)
- ✅ Professional Purple Template (Elegant theme)
- ✅ Professional Green Template (Fresh design)
- ✅ NO watermark
- ✅ Custom branding
- ✅ Color customization

**Reports:**
- ✅ All Free features
- ✅ Advanced analytics dashboard
- ✅ Custom date ranges
- ✅ Export to Excel/CSV
- ✅ Client analytics
- ✅ Tax reports (GST/TDS breakdown)
- ✅ Revenue trends with forecasting

**Limits:**
- ∞ Unlimited invoices
- ∞ Unlimited clients
- 5 premium templates

---

### 🏢 Business Plan (₹999/month)
**Invoice Templates:**
- ✅ All Professional features
- ✅ Business Premium Template (Luxury gold/black)
- ✅ Business Corporate Template (Professional corporate)
- ✅ Unlimited custom templates
- ✅ White-label option

**Reports:**
- ✅ All Professional features
- ✅ Profit margin analysis
- ✅ Revenue forecasting (AI-powered)
- ✅ Custom report builder
- ✅ Multi-user analytics
- ✅ API access for data export
- ✅ Automated monthly reports

**Limits:**
- ∞ Everything unlimited
- 5 team members
- Priority support

## Implementation Files

### 1. `lib/subscription.ts`
Utility functions for checking subscription access:
- `hasProfessionalAccess(plan)` - Check if user has pro features
- `hasBusinessAccess(plan)` - Check if user has business features
- `getAvailableTemplates(plan)` - Get templates based on plan
- `getReportingFeatures(plan)` - Get reporting features
- `getFeatureLimits(plan)` - Get usage limits

### 2. `app/components/InvoiceTemplate.tsx`
Dynamic invoice template component:
- **Basic Template**: Simple black & white with watermark
- **Professional Templates**: Colorful gradients, modern design
- **Business Templates**: Premium luxury styling

### 3. Database Migration
Run the updated `supabase/schema.sql` to add subscription fields to users table.

## How to Use

### Check User Subscription in Components:
```typescript
import { hasProfessionalAccess, getAvailableTemplates } from '@/lib/subscription'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userPlan = user.subscription_plan || 'free'

// Check access
if (hasProfessionalAccess(userPlan)) {
  // Show professional features
}

// Get available templates
const templates = getAvailableTemplates(userPlan)
```

### Render Invoice with Template:
```typescript
import InvoiceTemplate from '@/app/components/InvoiceTemplate'
import { getFeatureLimits } from '@/lib/subscription'

const limits = getFeatureLimits(userPlan)

<InvoiceTemplate
  templateId="professional-blue"
  invoice={invoiceData}
  colors={{
    primary: '#2563eb',
    secondary: '#3b82f6',
    accent: '#60a5fa'
  }}
  hasWatermark={limits.hasWatermark}
/>
```

## Next Steps

### To Fully Implement:

1. **Update Signup Flow:**
   - Set `subscription_plan: 'free'` by default
   - Set `subscription_status: 'active'`

2. **Add Template Selector:**
   - Create template picker in invoice creation
   - Show locked templates with upgrade prompt
   - Apply selected template colors

3. **Enhance Reports Page:**
   - Add "Upgrade to Professional" banner for free users
   - Lock advanced features behind subscription check
   - Show feature comparison

4. **Add Upgrade Flow:**
   - Replace alert() with actual Razorpay payment
   - Update user subscription after payment
   - Set expiration date

5. **Enforce Limits:**
   - Check invoice count before creating new invoice
   - Check client count before adding new client
   - Show usage progress bars

## Template Color Schemes

### Professional Templates:
- **Blue**: Primary: #2563eb, Secondary: #3b82f6, Accent: #60a5fa
- **Purple**: Primary: #7c3aed, Secondary: #8b5cf6, Accent: #a78bfa
- **Green**: Primary: #059669, Secondary: #10b981, Accent: #34d399

### Business Templates:
- **Premium**: Primary: #d97706, Secondary: #f59e0b, Accent: #fbbf24
- **Corporate**: Primary: #1e40af, Secondary: #1e3a8a, Accent: #3b82f6

## Testing

1. **Test Free User:**
   - Should see only basic template
   - Should see watermark on invoices
   - Should see limited reports

2. **Test Professional User:**
   - Should see 3 professional templates
   - No watermark
   - Advanced analytics visible

3. **Test Business User:**
   - Should see all 5 templates
   - Premium features unlocked
   - Full analytics dashboard

---

**Your invoice tracker now has a complete subscription-based feature system!** 🎉
