# 🔧 Troubleshooting "Failed to save data" Error

## Quick Fix Steps

### Step 1: Verify Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Make sure ALL these variables are set:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
FROM_EMAIL
ADMIN_EMAIL
NEXT_PUBLIC_APP_URL
JWT_SECRET
```

3. If any are missing, add them from your `.env.local` file
4. After adding, click "Redeploy" in Vercel

### Step 2: Check Supabase Connection

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ptdvrjyerqlmyordzzer`
3. Go to **Settings** → **API**
4. Verify these match your Vercel environment variables:
   - Project URL: `https://ptdvrjyerqlmyordzzer.supabase.co`
   - anon/public key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - service_role key (different from anon key)

### Step 3: Update Supabase URL Configuration

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://freelancer-invoice-sda.vercel.app`
3. Add **Redirect URLs**:
   - `https://freelancer-invoice-sda.vercel.app/auth/callback`
   - `https://freelancer-invoice-sda.vercel.app/auth/reset-password`
   - `https://freelancer-invoice-sda.vercel.app/*` (wildcard)
4. Click **Save**

### Step 4: Check Database Tables

1. In Supabase Dashboard → **Table Editor**
2. Verify the `waitlist` table exists
3. If not, run `supabase/fix-all-issues.sql` in SQL Editor

### Step 5: Test API Endpoint

Open this URL in your browser:
```
https://freelancer-invoice-sda.vercel.app/api/waitlist
```

You should see:
```json
{"success":true,"message":"Waitlist statistics retrieved","data":{"count":0}}
```

If you see an error, check Vercel Function Logs.

## Common Issues & Solutions

### Issue 1: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Solution:** Add environment variable in Vercel and redeploy

### Issue 2: "Failed to save data"
**Solution:** 
- Check Supabase service role key is correct
- Verify database tables exist
- Check RLS policies allow inserts

### Issue 3: "Database error occurred"
**Solution:**
- Run `supabase/fix-all-issues.sql` in Supabase SQL Editor
- Verify RLS policies are set correctly

### Issue 4: Environment variables not working
**Solution:**
1. In Vercel, make sure variables are set for **Production** environment
2. After adding/changing variables, you MUST redeploy
3. Go to Deployments → Click "..." → Redeploy

## Quick Test

Try this in your browser console on the live site:

```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

If it shows `undefined`, environment variables aren't loaded.

## Still Not Working?

### Check Vercel Function Logs:
1. Go to Vercel Dashboard → Your Project → Logs
2. Look for errors when submitting the form
3. Share the error message

### Check Browser Console:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Submit the form
4. Look for error messages

## Need Help?

If you're still stuck, check:
1. Vercel deployment logs for build errors
2. Supabase logs for database errors
3. Browser console for client-side errors

---

**Most Common Fix:** Add missing environment variables in Vercel and redeploy! 🚀
