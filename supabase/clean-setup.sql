-- Clean Setup for Invoicraft Database
-- This script safely recreates everything

-- ============================================
-- 1. DROP ALL EXISTING POLICIES (if they exist)
-- ============================================

DO $$ 
BEGIN
    -- Drop waitlist policies
    DROP POLICY IF EXISTS "waitlist_public_insert" ON public.waitlist;
    DROP POLICY IF EXISTS "waitlist_service_all" ON public.waitlist;
    DROP POLICY IF EXISTS "Allow public inserts on waitlist" ON public.waitlist;
    DROP POLICY IF EXISTS "Allow service role full access on waitlist" ON public.waitlist;
    
    -- Drop users policies
    DROP POLICY IF EXISTS "users_service_all" ON public.users;
    DROP POLICY IF EXISTS "Allow service role full access on users" ON public.users;
    
    -- Drop password reset policies
    DROP POLICY IF EXISTS "password_reset_service_all" ON public.password_reset_tokens;
    DROP POLICY IF EXISTS "Allow service role full access on password_reset_tokens" ON public.password_reset_tokens;
    
    -- Drop clients policies
    DROP POLICY IF EXISTS "clients_all" ON public.clients;
    DROP POLICY IF EXISTS "Allow all operations on clients" ON public.clients;
    
    -- Drop invoices policies
    DROP POLICY IF EXISTS "invoices_all" ON public.invoices;
    DROP POLICY IF EXISTS "Allow all operations on invoices" ON public.invoices;
    
    -- Drop invoice items policies
    DROP POLICY IF EXISTS "invoice_items_all" ON public.invoice_items;
    DROP POLICY IF EXISTS "Allow all operations on invoice_items" ON public.invoice_items;
END $$;

-- ============================================
-- 2. CREATE NEW POLICIES
-- ============================================

-- Waitlist: Allow public inserts, service role for everything
CREATE POLICY "waitlist_public_insert" 
ON public.waitlist 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "waitlist_service_all" 
ON public.waitlist 
FOR ALL 
TO service_role
USING (true);

-- Users: Service role only
CREATE POLICY "users_service_all" 
ON public.users 
FOR ALL 
TO service_role
USING (true);

-- Password Reset Tokens: Service role only
CREATE POLICY "password_reset_service_all" 
ON public.password_reset_tokens 
FOR ALL 
TO service_role
USING (true);

-- Clients: Allow all operations
CREATE POLICY "clients_all" 
ON public.clients 
FOR ALL 
TO public
USING (true);

-- Invoices: Allow all operations
CREATE POLICY "invoices_all" 
ON public.invoices 
FOR ALL 
TO public
USING (true);

-- Invoice Items: Allow all operations
CREATE POLICY "invoice_items_all" 
ON public.invoice_items 
FOR ALL 
TO public
USING (true);

-- ============================================
-- 3. VERIFY SETUP
-- ============================================

-- Show all policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database policies configured successfully!';
    RAISE NOTICE 'Tables: %, Policies: %', 
        (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public'),
        (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public');
END $$;
