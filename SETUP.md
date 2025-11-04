# Backend Setup Instructions

This guide will help you set up the backend functionality for the Freelance Invoice Tracker landing page.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment template:
```bash
cp .env.example .env.local
```

### 3. Choose Your Setup

You have two options:

#### Option A: Full Setup with Supabase (Recommended for Production)
#### Option B: Local Development with File Storage (Quick Start)

---

## 📊 Option A: Supabase Setup (Production)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

### 2. Set Up Database

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL to create the waitlist table

### 3. Get API Keys

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Configure Email (Optional)

For welcome emails, sign up at [resend.com](https://resend.com):

```env
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
```

---

## 🛠 Option B: Local Development (File Storage)

For quick local development, you can skip Supabase setup. The app will automatically use file-based storage.

Just make sure these are NOT set in your `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The app will create a `data/waitlist.json` file to store signups locally.

---

## 🧪 Testing

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test the Waitlist Form

1. Open http://localhost:3000
2. Fill out the waitlist form
3. Check for success/error messages

### 3. Verify Data Storage

**With Supabase:**
- Check your Supabase dashboard > Table Editor > waitlist

**With File Storage:**
- Check the `data/waitlist.json` file in your project

### 4. Test API Endpoints

**Add to waitlist:**
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","profession":"developer"}'
```

**Get waitlist count:**
```bash
curl http://localhost:3000/api/waitlist
```

---

## 🔒 Security Features

- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention
- ✅ Duplicate email prevention
- ✅ Rate limiting ready (add middleware if needed)
- ✅ Environment variable protection
- ✅ Error handling and logging

---

## 📧 Email Configuration

### Resend Setup (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use their test domain
3. Get your API key
4. Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

### Alternative Email Services

You can easily swap Resend for other services by modifying `lib/email.ts`:
- SendGrid
- Mailgun
- AWS SES
- Nodemailer with SMTP

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

---

## 📊 Database Schema

```sql
-- Waitlist table structure
CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    profession VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🐛 Troubleshooting

### Common Issues

**"Database error occurred"**
- Check your Supabase credentials
- Verify the database table exists
- Check Supabase logs

**"Network error"**
- Check if the dev server is running
- Verify API route exists at `/api/waitlist`
- Check browser console for errors

**Email not sending**
- Verify Resend API key
- Check FROM_EMAIL domain is verified
- Look at server logs for email errors

### Debug Mode

Add this to your `.env.local` for detailed logging:
```env
NODE_ENV=development
```

---

## 📈 Analytics & Monitoring

### Built-in Analytics

The app includes a waitlist analytics view:
```sql
SELECT * FROM waitlist_analytics;
```

### Add External Analytics

Consider adding:
- Google Analytics
- Mixpanel
- PostHog
- Plausible

---

## 🔄 Next Steps

1. **Customize Email Templates** - Edit `lib/email.ts`
2. **Add Rate Limiting** - Implement in API routes
3. **Admin Dashboard** - Create admin pages to view signups
4. **Export Data** - Add CSV export functionality
5. **A/B Testing** - Test different form designs
6. **Social Sharing** - Add referral tracking

---

## 💡 Tips

- Test with real email addresses to verify email delivery
- Monitor your Supabase usage to avoid hitting limits
- Set up database backups for production
- Consider adding CAPTCHA for spam prevention
- Use TypeScript for better development experience

---

## 🆘 Support

If you run into issues:
1. Check the troubleshooting section above
2. Review the error logs
3. Verify your environment variables
4. Test with the fallback storage first

Happy coding! 🚀