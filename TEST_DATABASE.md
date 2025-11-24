# 🔍 Database Setup Test

## The Problem
You're getting "Database insertion failed" when creating invoices. This means:
1. The database tables don't exist yet, OR
2. The tables exist but have the wrong structure, OR
3. There's a permission issue

## Quick Fix - Run This SQL

Go to: https://supabase.com/dashboard/project/ptdvrjyerqlmyordzzer/sql/new

Copy and paste this SIMPLE test SQL first:

```sql
-- Test if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'clients', 'invoices', 'invoice_items');
```

Click "Run". You should see 4 tables listed.

### If you see 0 tables or missing tables:
Then run the FULL schema from `supabase/schema-fixed.sql`

### If you see all 4 tables:
Then the issue might be with the `generate_invoice_number` function. Run this:

```sql
-- Test the function
SELECT generate_invoice_number();
```

If this gives an error, run this fix:

```sql
-- Drop and recreate the function
DROP FUNCTION IF EXISTS public.generate_invoice_number();

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    invoice_number TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-([0-9]+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.invoices
    WHERE invoice_number ~ '^INV-[0-9]+$';
    
    invoice_number := 'INV-' || LPAD(next_number::TEXT, 3, '0');
    
    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;
```

## Alternative: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try creating an invoice again
4. Look for the actual error message
5. Share that error with me

## Most Likely Issue

You haven't run the SQL schema yet! The tables don't exist in your Supabase database.

**Solution:** Run the complete SQL from `supabase/schema-fixed.sql` in your Supabase SQL Editor.
