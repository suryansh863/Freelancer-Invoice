# ✅ Deployment Checklist for Invoicraft

## Pre-Deployment Checklist

### 1. Code Quality
- [x] Build passes successfully (`npm run build`)
- [x] No TypeScript errors
- [x] All components render correctly
- [x] Dark mode works properly

### 2. Environment Variables Setup

Before deploying, gather these credentials:

#### Supabase (Database)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

**Get from:** https://app.supabase.com → Your Project → Settings → API

#### Razorpay (Payments)
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay Key ID
- [ ] `RAZORPAY_KEY_SECRET` - Razorpay Secret Key

**Get from:** https://dashboard.razorpay.com → Settings → API Keys

#### Resend (Emails)
- [ ] `RESEND_API_KEY` - Resend API key
- [ ] `FROM_EMAIL` - Verified sender email (e.g., noreply@yourdomain.com)

**Get from:** https://resend.com/api-keys

#### Application
- [ ] `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., https://invoicraft.vercel.app)
- [ ] `JWT_SECRET` - Random 32+ character string for security

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database Setup
- [ ] Run `supabase/schema-fixed.sql` in Supabase SQL Editor
- [ ] Verify all tables are created
- [ ] Test database connection

### 4. Git Repository
- [x] All changes committed
- [ ] Push to GitHub: `git push origin main`
- [ ] Repository is public or accessible to Vercel

## Deployment Steps

### Step 1: Deploy to Vercel

1. **Visit Vercel Dashboard**
   ```
   https://vercel.com/new
   ```

2. **Import Repository**
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**
   Copy all variables from your checklist above into Vercel:
   - Go to "Environment Variables" section
   - Add each variable one by one
   - Select: Production, Preview, Development

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes

### Step 2: Post-Deployment Configuration

#### Update Supabase
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add Site URL: `https://your-domain.vercel.app`
3. Add Redirect URLs:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/auth/reset-password`

#### Update Razorpay
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add Webhook URL: `https://your-domain.vercel.app/api/payments/webhook`
3. Select Events: `payment.captured`, `payment.failed`

#### Verify Resend
1. Ensure FROM_EMAIL domain is verified in Resend
2. Test password reset email functionality

### Step 3: Testing

Test these features on production:

- [ ] Landing page loads
- [ ] User signup works
- [ ] User login works
- [ ] Password reset email sends
- [ ] Dashboard loads
- [ ] Create new client
- [ ] Create new invoice
- [ ] View invoice
- [ ] Edit invoice
- [ ] Payment button works
- [ ] Dark mode toggle
- [ ] Pricing page loads
- [ ] Terms & Privacy pages load

## Optional: Custom Domain

1. **In Vercel Dashboard**
   - Go to Project → Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., invoicraft.com)

2. **Update DNS Records**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record to Vercel's IP (shown in dashboard)

3. **Update Environment Variables**
   - Change `NEXT_PUBLIC_APP_URL` to your custom domain
   - Redeploy

4. **Update Supabase & Razorpay**
   - Update all URLs to use custom domain

## Monitoring & Maintenance

### After Deployment

- [ ] Monitor Vercel Analytics
- [ ] Check Vercel Logs for errors
- [ ] Monitor Supabase usage
- [ ] Check Razorpay transactions
- [ ] Test email delivery

### Regular Maintenance

- Update dependencies monthly: `npm update`
- Monitor error logs weekly
- Backup database regularly
- Review security settings

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all dependencies in package.json
- Run `npm run build` locally first

### Runtime Errors
- Check Vercel Function Logs
- Verify environment variables are set
- Check browser console for client errors

### Database Issues
- Verify Supabase connection
- Check SQL schema is applied
- Review Supabase logs

### Payment Issues
- Verify Razorpay keys (test vs live)
- Check webhook configuration
- Review Razorpay dashboard logs

## Quick Commands

```bash
# Test build locally
npm run build

# Start production server locally
npm start

# Push changes and auto-deploy
git add .
git commit -m "Your changes"
git push origin main

# View deployment logs
vercel logs
```

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Razorpay Docs:** https://razorpay.com/docs
- **Resend Docs:** https://resend.com/docs

---

**Ready to deploy? Follow the steps above and your Invoicraft will be live! 🚀**
