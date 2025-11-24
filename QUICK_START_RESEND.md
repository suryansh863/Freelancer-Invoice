# 🚀 Quick Start: Enable Password Reset Emails

## 3-Minute Setup

### Step 1: Get Resend API Key (2 min)
1. Go to https://resend.com and sign up (free!)
2. Click "API Keys" → "Create API Key"
3. Copy the key (starts with `re_`)

### Step 2: Add to .env.local (30 sec)
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev
```

### Step 3: Update Database (30 sec)
1. Go to: https://supabase.com/dashboard/project/ptdvrjyerqlmyordzzer/sql/new
2. Copy ALL content from `supabase/schema.sql`
3. Paste and click "Run"

### Step 4: Restart Server
```bash
npm run dev
```

### Step 5: Test It! ✨
1. Go to http://localhost:3000/auth/login
2. Click "Forgot password?"
3. Enter your email
4. Check inbox for reset email!

---

## ✅ What Works Now

✅ Forgot password link on login page  
✅ Password reset emails sent via Resend  
✅ Secure token-based reset (1-hour expiry)  
✅ Professional HTML email templates  
✅ Form data preserved when viewing terms/privacy  

## 📧 For Production

When deploying:
1. Verify your domain in Resend
2. Change `FROM_EMAIL=noreply@yourdomain.com`
3. Update `NEXT_PUBLIC_APP_URL=https://yourdomain.com`

---

**That's it! Your password reset system is ready!** 🎉

For detailed docs, see `RESEND_SETUP.md`
