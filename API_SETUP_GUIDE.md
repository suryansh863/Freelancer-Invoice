# 🔑 Complete API Setup Guide

## Required APIs for Your Invoice Tracker

Your website needs **2 CRITICAL APIs** to function properly:

---

## 1. 🗄️ Supabase (Database) - **REQUIRED**

### What it does:
- Stores user accounts
- Stores clients data
- Stores invoices data
- Handles authentication
- Provides secure database

### Setup Steps:

#### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. **Cost**: FREE (up to 500MB database, 2GB bandwidth)

#### Step 2: Create New Project
1. Click "New Project"
2. Choose organization (or create one)
3. Fill in:
   - **Project Name**: `invoice-tracker` (or your choice)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to India (Singapore recommended)
4. Click "Create new project"
5. Wait 2-3 minutes for setup

#### Step 3: Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

#### Step 4: Run Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy the entire content from `supabase/schema.sql` in your project
4. Paste it in the SQL editor
5. Click "Run" or press Ctrl+Enter
6. You should see "Success. No rows returned"

#### Step 5: Set Environment Variables
Add to your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ✅ Verification:
- Users can sign up
- Users can log in
- Dashboard loads without errors
- Can create clients and invoices

---

## 2. 💳 Razorpay (Payment Gateway) - **REQUIRED for Payments**

### What it does:
- Processes payments
- Generates payment links
- Handles UPI, cards, net banking
- Provides payment verification

### Setup Steps:

#### Step 1: Create Razorpay Account
1. Go to [https://razorpay.com](https://razorpay.com)
2. Click "Sign Up"
3. Fill in business details:
   - Business Name
   - Email
   - Phone Number
4. Verify email and phone
5. **Cost**: FREE signup, 2% per transaction

#### Step 2: Complete KYC (For Live Mode)
1. Go to **Account & Settings** → **KYC**
2. Upload required documents:
   - PAN Card
   - Business Registration (if company)
   - Bank Account Details
   - Address Proof
3. Wait 24-48 hours for approval
4. **Note**: You can use Test Mode immediately without KYC

#### Step 3: Get API Keys

**For Testing (Available Immediately):**
1. Go to **Settings** → **API Keys**
2. Switch to **Test Mode** (toggle at top)
3. Click "Generate Test Key"
4. Copy:
   ```
   Key ID: rzp_test_xxxxxxxxxxxxx
   Key Secret: xxxxxxxxxxxxxxxxxxxxx
   ```

**For Production (After KYC Approval):**
1. Switch to **Live Mode**
2. Click "Generate Live Key"
3. Copy:
   ```
   Key ID: rzp_live_xxxxxxxxxxxxx
   Key Secret: xxxxxxxxxxxxxxxxxxxxx
   ```

#### Step 4: Set Environment Variables

**For Testing:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
```

**For Production:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
```

#### Step 5: Configure Webhooks (Optional but Recommended)
1. Go to **Settings** → **Webhooks**
2. Click "Add New Webhook"
3. Enter URL: `https://yourdomain.com/api/webhooks/razorpay`
4. Select events:
   - `payment.captured`
   - `payment.failed`
5. Copy webhook secret
6. Add to `.env.local`:
   ```env
   RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### ✅ Verification:
- Payment button appears on invoices
- Can generate payment links
- Test payment works (use test cards)
- Payment verification succeeds

### 💳 Test Cards for Razorpay:
```
Success: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
OTP: 1234

Failure: 4111 1111 1111 1112
```

---

## 3. 📧 Email Service (Optional - For Notifications)

### What it does:
- Send invoice emails
- Send payment reminders
- Send welcome emails
- Password reset emails

### Options:

#### Option A: Gmail SMTP (Easiest)
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Select "Mail" and "Other"
   - Copy the 16-character password
3. Add to `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   SMTP_FROM=noreply@yourdomain.com
   ```

#### Option B: SendGrid (Recommended for Production)
1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create API key
3. **Cost**: FREE (100 emails/day)
4. Add to `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```

#### Option C: AWS SES (Cheapest for Scale)
1. Sign up for AWS
2. Verify domain
3. **Cost**: $0.10 per 1000 emails
4. Add credentials to `.env.local`

---

## 4. 🔍 Analytics (Optional - Recommended)

### Google Analytics
1. Go to [https://analytics.google.com](https://analytics.google.com)
2. Create property
3. Get Measurement ID (G-XXXXXXXXXX)
4. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

---

## 5. 🐛 Error Tracking (Optional - Recommended)

### Sentry
1. Go to [https://sentry.io](https://sentry.io)
2. Create project
3. Get DSN
4. **Cost**: FREE (5,000 errors/month)
5. Add to `.env.local`:
   ```env
   SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   ```

---

## 📋 Complete Environment Variables Template

Create `.env.local` file in your project root:

```env
# ============================================
# REQUIRED - Database (Supabase)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# REQUIRED - Payment Gateway (Razorpay)
# ============================================
# Use test keys for development
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here

# Use live keys for production (after KYC)
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
# RAZORPAY_KEY_SECRET=your_live_secret_key

# ============================================
# REQUIRED - Application URL
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production: https://yourdomain.com

# ============================================
# OPTIONAL - Email Service (Gmail SMTP)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com

# ============================================
# OPTIONAL - Analytics
# ============================================
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ============================================
# OPTIONAL - Error Tracking
# ============================================
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# ============================================
# OPTIONAL - Security
# ============================================
JWT_SECRET=your-random-secret-key-here
ENCRYPTION_KEY=your-random-encryption-key
```

---

## 🚀 Quick Start Checklist

### Minimum to Get Started (15 minutes):
- [ ] Create Supabase account
- [ ] Create Supabase project
- [ ] Copy Supabase API keys
- [ ] Run database schema
- [ ] Add Supabase keys to `.env.local`
- [ ] Restart dev server
- [ ] Test signup/login

### For Payment Features (30 minutes):
- [ ] Create Razorpay account
- [ ] Get test API keys
- [ ] Add Razorpay keys to `.env.local`
- [ ] Restart dev server
- [ ] Test payment link generation
- [ ] Test payment with test card

### For Production (1-2 days):
- [ ] Complete Razorpay KYC
- [ ] Get live Razorpay keys
- [ ] Set up custom domain
- [ ] Configure email service
- [ ] Set up analytics
- [ ] Set up error tracking
- [ ] Deploy to Vercel

---

## 💰 Cost Summary

### Free Tier (Perfect for Starting):
- **Supabase**: FREE (500MB database, 2GB bandwidth)
- **Razorpay**: FREE signup (2% per transaction)
- **Vercel**: FREE (100GB bandwidth)
- **SendGrid**: FREE (100 emails/day)
- **Sentry**: FREE (5,000 errors/month)
- **Total Monthly Cost**: ₹0 + 2% transaction fee

### Paid Tier (When You Scale):
- **Supabase Pro**: $25/month (8GB database, 50GB bandwidth)
- **Razorpay**: 2% per transaction (no monthly fee)
- **Vercel Pro**: $20/month (1TB bandwidth)
- **SendGrid**: $15/month (40,000 emails)
- **Total**: ~₹5,000/month + transaction fees

---

## 🆘 Troubleshooting

### "Database not configured" error:
- Check if Supabase keys are in `.env.local`
- Restart dev server after adding keys
- Verify keys are correct (no extra spaces)

### "Payment link creation failed":
- Check if Razorpay keys are correct
- Verify you're using test keys in development
- Check Razorpay dashboard for errors

### "Cannot connect to database":
- Verify Supabase project is active
- Check if database schema is run
- Verify network connection

### "Invalid API key":
- Regenerate keys in respective dashboards
- Update `.env.local` with new keys
- Restart server

---

## 📞 Support Links

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Support**: https://supabase.com/support
- **Razorpay Docs**: https://razorpay.com/docs
- **Razorpay Support**: https://razorpay.com/support
- **Vercel Docs**: https://vercel.com/docs

---

## ✅ Final Checklist

Before going live, ensure:
- [ ] Supabase is configured and working
- [ ] Database schema is run successfully
- [ ] Users can sign up and log in
- [ ] Razorpay test mode is working
- [ ] Can create clients and invoices
- [ ] Payment links generate successfully
- [ ] Test payment completes
- [ ] All environment variables are set
- [ ] Application runs without errors

---

**Last Updated**: November 22, 2024
**Status**: Ready for Setup

Need help? Check the documentation or contact support!
