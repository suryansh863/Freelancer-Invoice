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