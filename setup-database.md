# Database Setup Instructions

## Step 1: Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/ptdvrjyerqlmyordzzer/settings/api
2. Scroll to "Project API keys"
3. Copy the **service_role** key (marked as secret)
4. Open `.env.local` file
5. Replace `your_service_role_key_here` with your actual key

## Step 2: Run Database Schema

1. Go to: https://supabase.com/dashboard/project/ptdvrjyerqlmyordzzer/sql/new
2. Copy the entire content from `supabase/schema.sql` file
3. Paste it in the SQL Editor
4. Click "Run" or press Ctrl+Enter
5. You should see "Success. No rows returned"

## Step 3: Verify Setup

Run this command to check if everything is configured:

```bash
npm run dev
```

Then try to:
1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill in the signup form
4. If signup works, your database is configured correctly!

## Troubleshooting

### Error: "Database not configured"
- Make sure you added the service_role key to `.env.local`
- Restart your dev server after adding the key

### Error: "relation does not exist"
- You haven't run the database schema yet
- Go to Supabase SQL Editor and run the schema

### Error: "Invalid API key"
- Double-check your keys in `.env.local`
- Make sure there are no extra spaces
- Keys should be on the same line

## What Each Key Does

- **NEXT_PUBLIC_SUPABASE_URL**: Your database URL (public, safe to expose)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Public key for client-side (public, safe to expose)
- **SUPABASE_SERVICE_ROLE_KEY**: Admin key for server-side (SECRET, never expose!)

## Security Note

⚠️ **NEVER commit `.env.local` to git!**
- It's already in `.gitignore`
- The service_role key has full database access
- Keep it secret!
