-- ==============================================================================
-- Biniyog Adda (বিনিয়োগ আড্ডা) - Supabase Database Schema & Security Policies
-- ==============================================================================

-- 1. Create table: registrations
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL,
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 2 AND char_length(name) <= 100),
    phone_normalized TEXT NOT NULL CHECK (phone_normalized ~ '^01[3-9][0-9]{8}$'),
    occupation TEXT NOT NULL CHECK (char_length(occupation) <= 50),
    area TEXT NOT NULL CHECK (char_length(trim(area)) >= 1 AND char_length(area) <= 120),
    email TEXT CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    interest TEXT CHECK (interest IS NULL OR char_length(interest) <= 800),
    consent_version TEXT NOT NULL DEFAULT 'v1',
    consented_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'interested' CHECK (status IN ('interested', 'contacted', 'confirmed', 'cancelled')),
    status_updated_at TIMESTAMPTZ,
    status_updated_by UUID,
    source TEXT DEFAULT 'direct' CHECK (source IN ('direct', 'facebook', 'linkedin', 'whatsapp', 'referral', 'other')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_event_phone UNIQUE (event_id, phone_normalized)
);

-- 2. Indexing for performance
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON public.registrations(phone_normalized);

-- 3. Table for Admin Roles (Organizer Authentication)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'organizer' CHECK (role IN ('organizer', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 5. Helper Function: Is caller an organizer / admin?
CREATE OR REPLACE FUNCTION public.is_organizer()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

-- 6. RLS Policies on admin_users
CREATE POLICY "Admins can view admin_users list"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (public.is_organizer());

-- 7. RLS Policies on registrations
-- ANONYMOUS users cannot view, edit or delete any registration rows!
CREATE POLICY "No public read access"
    ON public.registrations
    FOR SELECT
    TO anon
    USING (false);

CREATE POLICY "Organizers can view all registrations"
    ON public.registrations
    FOR SELECT
    TO authenticated
    USING (public.is_organizer());

CREATE POLICY "Organizers can update registration status"
    ON public.registrations
    FOR UPDATE
    TO authenticated
    USING (public.is_organizer())
    WITH CHECK (public.is_organizer());

-- 8. Secure RPC for submitting registration
-- Validates consent, normalizes phone, enforces idempotency, prevents duplicate error leaks
CREATE OR REPLACE FUNCTION public.submit_registration(
    p_event_id TEXT,
    p_name TEXT,
    p_phone TEXT,
    p_occupation TEXT,
    p_area TEXT,
    p_email TEXT DEFAULT NULL,
    p_interest TEXT DEFAULT NULL,
    p_consent_given BOOLEAN DEFAULT false,
    p_honeypot TEXT DEFAULT NULL,
    p_source TEXT DEFAULT 'direct'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clean_name TEXT;
    v_clean_phone TEXT;
    v_clean_area TEXT;
    v_clean_email TEXT;
    v_clean_interest TEXT;
    v_clean_source TEXT;
    v_existing_id UUID;
BEGIN
    -- Check honeypot (bots fill this in)
    IF p_honeypot IS NOT NULL AND length(trim(p_honeypot)) > 0 THEN
        -- Silently accept bot spam to not alert them, but do not write
        RETURN jsonb_build_object('success', true, 'message', 'registered');
    END IF;

    -- Validate explicit consent
    IF p_consent_given IS NOT TRUE THEN
        RETURN jsonb_build_object('success', false, 'error', 'সম্মতি প্রদান আবশ্যক।');
    END IF;

    -- Clean strings
    v_clean_name := trim(p_name);
    v_clean_area := trim(p_area);
    v_clean_email := NULLIF(trim(p_email), '');
    v_clean_interest := NULLIF(trim(p_interest), '');
    
    -- Normalize source to allowlisted values
    v_clean_source := CASE 
        WHEN p_source IN ('direct', 'facebook', 'linkedin', 'whatsapp', 'referral') THEN p_source
        ELSE 'direct'
    END;

    -- Name validation
    IF length(v_clean_name) < 2 OR length(v_clean_name) > 100 THEN
        RETURN jsonb_build_object('success', false, 'error', 'নাম ২ থেকে ১০০ অক্ষরের মধ্যে হতে হবে।');
    END IF;

    -- Area validation
    IF length(v_clean_area) < 1 OR length(v_clean_area) > 120 THEN
        RETURN jsonb_build_object('success', false, 'error', 'এলাকা বা জেলা উল্লেখ করুন।');
    END IF;

    -- Phone normalization:
    -- Convert Bangla digits to English digits
    v_clean_phone := translate(p_phone, '০১২৩৪৫৬৭৮৯', '0123456789');
    -- Strip non-digit characters except leading plus
    v_clean_phone := regexp_replace(v_clean_phone, '[^0-9+]', '', 'g');
    -- Strip +88 or 88 prefix
    IF v_clean_phone ~ '^\+?880' THEN
        v_clean_phone := regexp_replace(v_clean_phone, '^\+?88', '');
    END IF;

    -- Validate Bangladesh mobile number format: ^01[3-9][0-9]{8}$
    IF v_clean_phone !~ '^01[3-9][0-9]{8}$' THEN
        RETURN jsonb_build_object('success', false, 'error', 'সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন।');
    END IF;

    -- Validate optional email
    IF v_clean_email IS NOT NULL AND v_clean_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RETURN jsonb_build_object('success', false, 'error', 'সঠিক ইমেইল ঠিকানা দিন।');
    END IF;

    -- Check if phone already registered for this event
    SELECT id INTO v_existing_id
    FROM public.registrations
    WHERE event_id = p_event_id AND phone_normalized = v_clean_phone
    LIMIT 1;

    IF v_existing_id IS NOT NULL THEN
        -- Idempotent return: do not overwrite, do not reveal duplicate info
        RETURN jsonb_build_object('success', true, 'message', 'registered', 'duplicate', true);
    END IF;

    -- Insert new registration
    INSERT INTO public.registrations (
        event_id,
        name,
        phone_normalized,
        occupation,
        area,
        email,
        interest,
        consent_version,
        consented_at,
        status,
        source
    ) VALUES (
        p_event_id,
        v_clean_name,
        v_clean_phone,
        p_occupation,
        v_clean_area,
        v_clean_email,
        v_clean_interest,
        'v1',
        timezone('utc'::text, now()),
        'interested',
        v_clean_source
    );

    RETURN jsonb_build_object('success', true, 'message', 'registered');
EXCEPTION
    WHEN unique_violation THEN
        -- Concurrent repeat submission safeguard
        RETURN jsonb_build_object('success', true, 'message', 'registered', 'duplicate', true);
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'তথ্য জমা হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
END;
$$;

-- Grant execution to anon and authenticated callers
GRANT EXECUTE ON FUNCTION public.submit_registration TO anon, authenticated;
