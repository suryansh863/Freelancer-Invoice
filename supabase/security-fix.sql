-- Security Fix for Supabase Functions
-- Run this SQL in your Supabase SQL Editor to fix the search_path security warning

-- Drop and recreate the handle_updated_at function with proper security settings
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Recreate all triggers that use this function
DROP TRIGGER IF EXISTS handle_waitlist_updated_at ON public.waitlist;
DROP TRIGGER IF EXISTS handle_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS handle_clients_updated_at ON public.clients;
DROP TRIGGER IF EXISTS handle_invoices_updated_at ON public.invoices;

CREATE TRIGGER handle_waitlist_updated_at 
    BEFORE UPDATE ON public.waitlist 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_clients_updated_at 
    BEFORE UPDATE ON public.clients 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_invoices_updated_at 
    BEFORE UPDATE ON public.invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

-- Fix the generate_invoice_number function as well
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
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;
