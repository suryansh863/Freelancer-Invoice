# Deployment Guide - Invoicraft

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
1. GitHub account
2. Vercel account (free tier available)
3. Supabase account (free tier available)
4. Razorpay account (for payments)

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
4. Go to **Settings** → **API**
5. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### Step 2: Set Up Razorpay

1. Go to [razorpay.com](https://razorpay.com)
2. Sign up and complete KYC
3. Go to **Settings** → **API Keys**
4. Generate keys (use Test Mode for testing)
5. Copy:
   - Key ID
   - Key Secret

### Step 3: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **Import Project**
4. Select your GitHub repository
5. Configure environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

6. Click **Deploy**
7. Wait for deployment to complete
8. Visit your live site!

## 🔧 Manual Deployment

### Build for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

### Environment Setup

1. Copy `.env.example` to `.env.production`
2. Fill in all required values
3. Never commit `.env.production` to git

## 📊 Post-Deployment Checklist

### Immediate Actions
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Create a test invoice
- [ ] Test payment flow (usgured)
- [ ] Test on mobile devices
- [ ] Check all pages load correctly

### Security Verification
- [ ] HTTPS is enabled
- [ ] Security headers are present (check with securityheaders.com)
- [ ] No sensitive data in client-side code
- [ ] API routes are protected
- [ ] Rate limiting is working

### Performance Check
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Test page load times
- [ ] Verify images are optimized
- [ ] Check mobile performance
- [ ] Test with slow 3G connection

### Monitoring Setup
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure uptime monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up database monitoring
- [ ] Configure backup alerts

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## 🌐 Custom Domain

### Add Custom Domain to Vercel

1. Go to your project settings in Vercel
2. Click **Domains**
3. Add your domain
4. Update DNS records as instructed
5. Wait for DNS propagation (up to 48 hours)
6. SSL certificate is automatically provisioned

### Update Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📈 Scaling Considerations

### Database
- Monitor connection pool usage
- Set up read replicas if needed
- Enable connection pooling in Supabase
- Consider upgrading Supabase plan for more connections

### Application
- Vercel auto-scales by default
- Monitor function execution times
- Optimize slow API routes
- Use caching where appropriate

### Costs
- **Vercel Free Tier**: 100GB bandwidth, unlimited deployments
- **Supabase Free Tier**: 500MB database, 2GB bandwidth
- **Razorpay**: Pay per transaction (2% for domestic cards)

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working
- Ensure variables are set in Vercel dashboard
- Redeploy after adding new variables
- Check variable names match exactly

### Database Connection Issues
- Verify Supabase URL and keys
- Check if IP is whitelisted (Supabase allows all by default)
- Ensure RLS policies are correct

### Payment Issues
- Verify Razorpay keys are correct
- Check if using Test Mode keys in production
- Ensure webhook URLs are configured

## 📞 Support

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Razorpay Support**: [razorpay.com/support](https://razorpay.com/support)

## 🔐 Security Best Practices

1. **Never commit secrets** to git
2. **Rotate keys** regularly (every 90 days)
3. **Use different keys** for development and production
4. **Enable 2FA** on all service accounts
5. **Monitor** for suspicious activity
6. **Keep dependencies** updated
7. **Regular backups** of database
8. **Test disaster recovery** procedures

## 📝 Maintenance

### Weekly
- Check error logs
- Monitor performance metrics
- Review user feedback

### Monthly
- Update dependencies
- Review security advisories
- Backup verification
- Performance optimization

### Quarterly
- Security audit
- Dependency audit
- Cost optimization review
- Feature usage analysis

---

**Need Help?** Check our [GitHub Issues](https://github.com/yourusername/invoice-tracker/issues) or contact support.

**Last Updated**: November 22, 2024
