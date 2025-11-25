# 🚀 Deploy Invoicraft to Vercel - Quick Guide

## Step 1: Go to Vercel

**Click this link:** https://vercel.com/new

## Step 2: Import Your Repository

1. Sign in with GitHub
2. Click "Import Project"
3. Find and select: `suryansh863/Freelancer-Invoice`
4. Click "Import"

## Step 3: Configure Project

Vercel will auto-detect Next.js. Just verify:
- ✅ Framework Preset: **Next.js**
- ✅ Root Directory: `./`
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`

## Step 4: Add Environment Variables

Click "Environment Variables" and add these **one by one**:

### Required Variables (Copy-Paste):

```
NEXT_PUBLIC_SUPABASE_URL
```
Value: `https://ptdvrjyerqlmyordzzer.supabase.co`

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0ZHZyanllcnFsbXlvcmR6emVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTI3NjEsImV4cCI6MjA3OTM2ODc2MX0.fXRPLEiua3IoMIl1QTVtm9s6StRrIlWpyDR28KqRfYs`

```
SUPABASE_SERVICE_ROLE_KEY
```
Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0ZHZyanllcnFsbXlvcmR6emVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc5Mjc2MSwiZXhwIjoyMDc5MzY4NzYxfQ.WchkRNL0z8eOu3Mu5Din58NqXT1fmNgSN4UFP0gZM28`

```
RESEND_API_KEY
```
Value: `re_MGtLqZPe_5bqxMmfor1aQLKEasUaaHbV1`

```
FROM_EMAIL
```
Value: `onboarding@resend.dev`

```
NEXT_PUBLIC_APP_URL
```
Value: `https://your-app-name.vercel.app` (You'll update this after deployment)

```
JWT_SECRET
```
Value: Generate one using this command in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Important:
- Select **Production, Preview, and Development** for all variables
- Click "Add" after each variable

## Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://invoicraft-xyz.vercel.app`

## Step 6: Update App URL

After deployment:
1. Copy your Vercel URL
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Find `NEXT_PUBLIC_APP_URL`
4. Click "Edit" and update to your actual URL
5. Click "Save"
6. Redeploy (Vercel will auto-redeploy)

## Step 7: Update Supabase Settings

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: 
     - `https://your-app.vercel.app/auth/callback`
     - `https://your-app.vercel.app/auth/reset-password`

## Step 8: Test Your Deployment

Visit your Vercel URL and test:
- ✅ Landing page loads
- ✅ Sign up works
- ✅ Login works
- ✅ Dashboard loads
- ✅ Dark mode works

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are added

### Can't Login
- Check Supabase URL configuration
- Verify environment variables are correct

### Emails Not Sending
- Verify RESEND_API_KEY is correct
- Check FROM_EMAIL is valid

## Automatic Deployments

From now on, every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically deploy! 🎉

---

**Need help?** Check the full guide in `VERCEL_DEPLOY.md`

**Your Invoicraft is ready to go live! 🚀**
