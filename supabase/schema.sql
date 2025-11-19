-- Freelance Invoice Tracker - Waitlist Table Schema
-- Run this SQL in your Supabase SQL Editor

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    profession VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_profession ON public.waitlist(profession);

-- Enable Row Level Security (RLS)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for signup)
CREATE POLICY "Allow public inserts" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- Create policy to allow service role to read all data
CREATE POLICY "Allow service role full access" ON public.waitlist
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_waitlist_updated_at
    BEFORE UPDATE ON public.waitlist
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.waitlist IS 'Stores waitlist signups for Freelance Invoice Tracker';
COMMENT ON COLUMN public.waitlist.id IS 'Unique identifier for each waitlist entry';
COMMENT ON COLUMN public.waitlist.name IS 'Full name of the person signing up';
COMMENT ON COLUMN public.waitlist.email IS 'Email address (unique constraint)';
COMMENT ON COLUMN public.waitlist.profession IS 'Professional category of the freelancer';
COMMENT ON COLUMN public.waitlist.created_at IS 'Timestamp when the entry was created';
COMMENT ON COLUMN public.waitlist.updated_at IS 'Timestamp when the entry was last updated';

-- Optional: Create a view for analytics (counts by profession)
CREATE OR REPLACE VIEW public.waitlist_analytics AS
SELECT 
    profession,
    COUNT(*) as count,
    MIN(created_at) as first_signup,
    MAX(created_at) as latest_signup
FROM public.waitlist 
GROUP BY profession
ORDER BY count DESC;

COMMENT ON VIEW public.waitlist_analytics IS 'Analytics view showing signup counts by profession';

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(255),
    address TEXT,
    gstin VARCHAR(15),
    pan VARCHAR(10),
    client_type VARCHAR(20) DEFAULT 'individual' CHECK (client_type IN ('individual', 'company')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    
    -- Invoice details
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    tds_rate DECIMAL(5,2) DEFAULT 0,
    tds_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    
    -- GST details
    cgst_rate DECIMAL(5,2) DEFAULT 0,
    cgst_amount DECIMAL(12,2) DEFAULT 0,
    sgst_rate DECIMAL(5,2) DEFAULT 0,
    sgst_amount DECIMAL(12,2) DEFAULT 0,
    igst_rate DECIMAL(5,2) DEFAULT 0,
    igst_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Payment details
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
    paid_amount DECIMAL(12,2) DEFAULT 0,
    payment_date DATE,
    upi_id VARCHAR(100),
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice items table for detailed line items
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    rate DECIMAL(12,2) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_gstin ON public.clients(gstin);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON public.invoices(invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);

-- Enable RLS for all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - in production, add user-based policies)
CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on invoices" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Allow all operations on invoice_items" ON public.invoice_items FOR ALL USING (true);

-- Create triggers for updated_at
CREATE TRIGGER handle_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    invoice_number TEXT;
BEGIN
    -- Get the next invoice number
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-(\d+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.invoices
    WHERE invoice_number ~ '^INV-\d+$';
    
    -- Format as INV-001, INV-002, etc.
    invoice_number := 'INV-' || LPAD(next_number::TEXT, 3, '0');
    
    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON TABLE public.clients IS 'Client information for invoice generation';
COMMENT ON TABLE public.invoices IS 'Invoice records with GST and TDS calculations';
COMMENT ON TABLE public.invoice_items IS 'Line items for each invoice';
-- U
sers table for authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  business_name VARCHAR(255),
  gstin VARCHAR(15),
  pan VARCHAR(10) NOT NULL,
  address TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
