# 🚀 Vercel Deployment Guide for Invoicraft

## Prerequisites

Before deploying, ensure you have:
- ✅ GitHub repository with your code pushed
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Supabase project set up with database schema
- ✅ Razorpay account (for payments)
- ✅ Resend account (for emails)

## Step 1: Prepare Your Environment Variables

You'll need these environment variables in Vercel:

### Required Variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Resend (Email)
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@yourdomain.com

# Security
JWT_SECRET=generate_a_random_32_character_string
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Sign in with GitHub

2. **Import Your Repository**
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all variables from Step 1
   - Make sure to add them for Production, Preview, and Development

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts and add environment variables when asked
```

## Step 3: Post-Deployment Configuration

### 1. Update Supabase Settings

In your Supabase project dashboard:
- Go to Authentication → URL Configuration
- Add your Vercel URL to "Site URL": `https://your-domain.vercel.app`
- Add to "Redirect URLs": `https://your-domain.vercel.app/auth/callback`

### 2. Update Razorpay Webhook

In Razorpay Dashboard:
- Go to Settings → Webhooks
- Add webhook URL: `https://your-domain.vercel.app/api/payments/webhook`
- Select events: `payment.captured`, `payment.failed`

### 3. Configure Custom Domain (Optional)

In Vercel Dashboard:
- Go to your project → Settings → Domains
- Add your custom domain
- Update DNS records as instructed
- Update `NEXT_PUBLIC_APP_URL` environment variable

### 4. Verify Email Configuration

- Update `FROM_EMAIL` to use your verified domain in Resend
- Test password reset functionality

## Step 4: Verify Deployment

Test these critical features:

- [ ] Landing page loads correctly
- [ ] User signup works
- [ ] User login works
- [ ] Password reset email sends
- [ ] Dashboard loads with data
- [ ] Invoice creation works
- [ ] Payment integration works
- [ ] Dark mode toggle works

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Solution: Add all required env vars in Vercel dashboard

**Error: Module not found**
- Solution: Run `npm install` locally and commit package-lock.json

### Runtime Errors

**Supabase connection fails**
- Check if SUPABASE_URL and keys are correct
- Verify Supabase project is active

**Payment integration fails**
- Verify Razorpay keys (use test keys for testing)
- Check webhook configuration

**Emails not sending**
- Verify RESEND_API_KEY is correct
- Check FROM_EMAIL is verified in Resend

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically deploy
```

## Environment-Specific Deployments

- **Production**: `main` branch → your-domain.vercel.app
- **Preview**: Other branches → auto-generated preview URLs
- **Development**: Local with `npm run dev`

## Performance Optimization

Your app is already optimized with:
- ✅ Next.js 14 with App Router
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Security headers configured
- ✅ Compression enabled
- ✅ Edge functions for API routes

## Monitoring

After deployment, monitor:
- Vercel Analytics (built-in)
- Vercel Logs for errors
- Supabase Dashboard for database queries
- Razorpay Dashboard for payments

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Check Supabase logs
4. Verify all environment variables are set

---

**Your Invoicraft is now live! 🎉**

Share your deployment URL and start managing invoices!
