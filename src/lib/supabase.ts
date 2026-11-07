import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isBackendConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here'
  );
};

export const supabase: SupabaseClient | null = isBackendConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface RegistrationSubmission {
  eventId: string;
  name: string;
  phoneNormalized: string;
  occupation: string;
  area: string;
  email?: string;
  interest?: string;
  consentGiven: boolean;
  honeypot?: string;
  source?: string;
}

export interface SubmissionResponse {
  success: boolean;
  message?: string;
  error?: string;
  duplicate?: boolean;
}

/**
 * Submits registration to Supabase via RPC or direct insert with strict error handling.
 */
export async function submitRegistration(data: RegistrationSubmission): Promise<SubmissionResponse> {
  if (!isBackendConfigured() || !supabase) {
    return {
      success: false,
      error: 'ডাটাবেজ সংযোগ এখনো সক্রিয় করা হয়নি। অনুগ্রহ করে আয়োজকের সাথে যোগাযোগ করুন।',
    };
  }

  // Check honeypot spam
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return { success: true, message: 'registered' };
  }

  try {
    // Attempt via RPC submit_registration first
    const { data: rpcData, error: rpcError } = await supabase.rpc('submit_registration', {
      p_event_id: data.eventId,
      p_name: data.name.trim(),
      p_phone: data.phoneNormalized,
      p_occupation: data.occupation,
      p_area: data.area.trim(),
      p_email: data.email?.trim() || null,
      p_interest: data.interest?.trim() || null,
      p_consent_given: data.consentGiven,
      p_honeypot: data.honeypot || null,
      p_source: data.source || 'direct',
    });

    if (rpcError) {
      // If RPC is not created yet, fallback to direct insert
      console.warn('RPC not available, trying direct insert fallback:', rpcError.message);
      
      const { error: insertError } = await supabase.from('registrations').insert([
        {
          event_id: data.eventId,
          name: data.name.trim(),
          phone_normalized: data.phoneNormalized,
          occupation: data.occupation,
          area: data.area.trim(),
          email: data.email?.trim() || null,
          interest: data.interest?.trim() || null,
          consent_version: 'v1',
          consented_at: new Date().toISOString(),
          status: 'interested',
          source: data.source || 'direct',
        },
      ]);

      if (insertError) {
        // Unique violation duplicate check
        if (insertError.code === '23505') {
          return { success: true, message: 'registered', duplicate: true };
        }
        console.error('Direct insert error:', insertError);
        return { success: false, error: 'তথ্য জমা হয়নি। আপনার লেখা তথ্য রেখে দেওয়া হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' };
      }

      return { success: true, message: 'registered' };
    }

    if (rpcData && typeof rpcData === 'object') {
      if (rpcData.success) {
        return { success: true, message: rpcData.message || 'registered', duplicate: rpcData.duplicate };
      } else {
        return { success: false, error: rpcData.error || 'তথ্য জমা হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।' };
      }
    }

    return { success: true, message: 'registered' };
  } catch (err: unknown) {
    console.error('Unexpected submission error:', err);
    return {
      success: false,
      error: 'তথ্য জমা হয়নি। আপনার লেখা তথ্য রেখে দেওয়া হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    };
  }
}
