# 📧 Resend Email Setup Guide

This guide will help you set up Resend for sending password reset emails and other transactional emails.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" (it's free!)
3. Verify your email address

### Step 2: Get Your API Key

1. After logging in, go to **API Keys** in the dashboard
2. Click "Create API Key"
3. Give it a name like "Invoice Tracker Production"
4. Select permissions: **Sending access**
5. Click "Create"
6. **Copy the API key** (you won't see it again!)

### Step 3: Add Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to **Domains** in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually takes a few minutes)

**For testing**, you can skip this and use Resend's test domain.

### Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# App URL (for password reset links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- Replace `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual API key
- For testing, use: `FROM_EMAIL=onboarding@resend.dev`
- For production, use your verified domain: `FROM_EMAIL=noreply@yourdomain.com`
- Update `NEXT_PUBLIC_APP_URL` to your production URL when deploying

### Step 5: Update Database Schema

Run the updated SQL schema in your Supabase dashboard to add the password reset tokens table:

```sql
-- This is already in supabase/schema.sql
-- Just run the entire schema again or add this part:

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);

ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access on password_reset_tokens" ON public.password_reset_tokens
    FOR ALL USING (true);
```

### Step 6: Test It!

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to: http://localhost:3000/auth/login

3. Click "Forgot password?"

4. Enter your email and submit

5. Check your email inbox for the password reset link!

## 📧 Email Features Enabled

Once configured, these features will work:

✅ **Password Reset Emails** - Users can reset forgotten passwords  
✅ **Welcome Emails** - New waitlist subscribers get a welcome email  
✅ **Professional Templates** - Beautiful HTML email templates  
✅ **Secure Links** - Time-limited reset tokens (1 hour expiry)  

## 🔒 Security Features

- Reset tokens expire after 1 hour
- Tokens can only be used once
- Tokens are cryptographically secure (32 bytes)
- Email enumeration protection (always returns success)
- Secure password hashing with bcrypt

## 🎨 Email Templates

The system includes two email templates:

1. **Password Reset Email** (`lib/email.ts`)
   - Clean, professional design
   - Clear call-to-action button
   - Security warning
   - Fallback text link

2. **Welcome Email** (`lib/email.ts`)
   - Welcoming message
   - Feature highlights
   - Launch information

## 🌐 Production Deployment

When deploying to production:

1. **Verify your domain** in Resend
2. Update environment variables:
   ```bash
   RESEND_API_KEY=re_live_xxxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. Test password reset flow in production
4. Monitor email delivery in Resend dashboard

## 📊 Monitoring

Check email delivery status in Resend dashboard:
- **Logs** - See all sent emails
- **Analytics** - Track open rates and clicks
- **Webhooks** - Get notified of bounces/complaints

## 💰 Pricing

Resend offers:
- **Free tier**: 3,000 emails/month
- **Pro tier**: $20/month for 50,000 emails
- **Enterprise**: Custom pricing

For most freelancers, the free tier is more than enough!

## 🆘 Troubleshooting

### Emails not sending?

1. Check your API key is correct in `.env.local`
2. Verify `FROM_EMAIL` is set correctly
3. Check Resend dashboard logs for errors
4. Restart your dev server after changing env vars

### Using test email?

If using `onboarding@resend.dev`:
- Emails will be sent to your Resend account email
- You won't see them in the recipient's inbox
- Check your Resend dashboard for test emails

### Domain not verified?

- DNS changes can take up to 48 hours
- Use `onboarding@resend.dev` for testing
- Check DNS propagation with tools like whatsmydns.net

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend React Email](https://react.email) - For advanced templates
- [Resend Status](https://status.resend.com) - Service status

## ✅ Checklist

- [ ] Created Resend account
- [ ] Got API key
- [ ] Added to `.env.local`
- [ ] Set FROM_EMAIL
- [ ] Set NEXT_PUBLIC_APP_URL
- [ ] Updated database schema
- [ ] Restarted dev server
- [ ] Tested password reset
- [ ] (Optional) Verified domain for production

---

**Need help?** Check the Resend documentation or open an issue!
