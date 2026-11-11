-- ==============================================================================
-- Orthalaap (অর্থালাপ) - Add Payment Method, Sender Phone & Transaction ID Fields
-- ==============================================================================

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('bKash', 'Nagad')),
  ADD COLUMN IF NOT EXISTS payment_sender_phone TEXT,
  ADD COLUMN IF NOT EXISTS transaction_id TEXT;

CREATE INDEX IF NOT EXISTS idx_registrations_trx_id ON public.registrations(transaction_id);

-- Update RPC to support optional/required payment fields gracefully
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
    p_source TEXT DEFAULT 'direct',
    p_payment_method TEXT DEFAULT NULL,
    p_payment_sender_phone TEXT DEFAULT NULL,
    p_transaction_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clean_name TEXT;
    v_clean_phone TEXT;
    v_clean_sender_phone TEXT;
    v_clean_area TEXT;
    v_clean_email TEXT;
    v_clean_interest TEXT;
    v_clean_source TEXT;
    v_clean_trx TEXT;
    v_existing_id UUID;
BEGIN
    IF p_honeypot IS NOT NULL AND length(trim(p_honeypot)) > 0 THEN
        RETURN jsonb_build_object('success', true, 'message', 'registered');
    END IF;

    IF p_consent_given IS NOT TRUE THEN
        RETURN jsonb_build_object('success', false, 'error', 'সম্মতি প্রদান আবশ্যক।');
    END IF;

    v_clean_name := trim(p_name);
    v_clean_area := trim(p_area);
    v_clean_email := NULLIF(trim(p_email), '');
    v_clean_interest := NULLIF(trim(p_interest), '');
    v_clean_trx := NULLIF(upper(trim(p_transaction_id)), '');

    v_clean_source := CASE 
        WHEN p_source IN ('direct', 'facebook', 'linkedin', 'whatsapp', 'referral') THEN p_source
        ELSE 'direct'
    END;

    IF length(v_clean_name) < 2 OR length(v_clean_name) > 100 THEN
        RETURN jsonb_build_object('success', false, 'error', 'নাম ২ থেকে ১০০ অক্ষরের মধ্যে হতে হবে।');
    END IF;

    IF length(v_clean_area) < 1 OR length(v_clean_area) > 120 THEN
        RETURN jsonb_build_object('success', false, 'error', 'এলাকা বা জেলা উল্লেখ করুন।');
    END IF;

    -- Phone normalization
    v_clean_phone := translate(p_phone, '০১২৩৪৫৬৭৮৯', '0123456789');
    v_clean_phone := regexp_replace(v_clean_phone, '[^0-9+]', '', 'g');
    IF v_clean_phone ~ '^\+?880' THEN
        v_clean_phone := regexp_replace(v_clean_phone, '^\+?88', '');
    END IF;

    IF v_clean_phone !~ '^01[3-9][0-9]{8}$' THEN
        RETURN jsonb_build_object('success', false, 'error', 'সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন।');
    END IF;

    -- Sender phone normalization (if supplied)
    IF p_payment_sender_phone IS NOT NULL AND length(trim(p_payment_sender_phone)) > 0 THEN
        v_clean_sender_phone := translate(p_payment_sender_phone, '০১২৩৪৫৬৭৮৯', '0123456789');
        v_clean_sender_phone := regexp_replace(v_clean_sender_phone, '[^0-9+]', '', 'g');
        IF v_clean_sender_phone ~ '^\+?880' THEN
            v_clean_sender_phone := regexp_replace(v_clean_sender_phone, '^\+?88', '');
        END IF;
    ELSE
        v_clean_sender_phone := NULL;
    END IF;

    IF v_clean_email IS NOT NULL AND v_clean_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RETURN jsonb_build_object('success', false, 'error', 'সঠিক ইমেইল ঠিকানা দিন।');
    END IF;

    SELECT id INTO v_existing_id
    FROM public.registrations
    WHERE event_id = p_event_id AND phone_normalized = v_clean_phone
    LIMIT 1;

    IF v_existing_id IS NOT NULL THEN
        RETURN jsonb_build_object('success', true, 'message', 'registered', 'duplicate', true);
    END IF;

    INSERT INTO public.registrations (
        event_id,
        name,
        phone_normalized,
        occupation,
        area,
        email,
        interest,
        payment_method,
        payment_sender_phone,
        transaction_id,
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
        p_payment_method,
        v_clean_sender_phone,
        v_clean_trx,
        'v2',
        timezone('utc'::text, now()),
        'interested',
        v_clean_source
    );

    RETURN jsonb_build_object('success', true, 'message', 'registered');
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object('success', true, 'message', 'registered', 'duplicate', true);
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'তথ্য জমা হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_registration TO anon, authenticated;
