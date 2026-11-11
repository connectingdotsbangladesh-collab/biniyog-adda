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
  paymentMethod: 'bKash' | 'Nagad';
  paymentSenderPhone: string;
  transactionId: string;
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

export interface StoredApplicant {
  id: string;
  name: string;
  phone_normalized: string;
  occupation: string;
  area: string;
  email: string | null;
  interest: string | null;
  payment_method?: 'bKash' | 'Nagad';
  payment_sender_phone?: string;
  transaction_id?: string;
  consent_version: string;
  consented_at: string;
  status: 'interested' | 'contacted' | 'confirmed' | 'cancelled';
  status_updated_at?: string | null;
  source: string;
  created_at: string;
}

const STORAGE_KEY = 'orthalaap_applications_v2';
const LEGACY_STORAGE_KEY = 'biniyog_adda_applications_v1';

// Initial preloaded sample applications so the admin can test immediately
const DEFAULT_APPLICANTS: StoredApplicant[] = [
  {
    id: 'app-001',
    name: 'তানভীর আহমেদ',
    phone_normalized: '01711223344',
    occupation: 'চাকরিজীবী',
    area: 'মিরপুর, ঢাকা',
    email: 'tanvir.ahmed@example.com',
    interest: 'চাকরির পাশাপাশি প্যাসিভ ইনকামের নির্ভরযোগ্য পদ্ধতিগুলো জানতে চাই।',
    payment_method: 'bKash',
    payment_sender_phone: '01711223344',
    transaction_id: 'BKA9X42MP1',
    consent_version: 'v2',
    consented_at: '2026-11-11T08:30:00.000Z',
    status: 'confirmed',
    status_updated_at: '2026-11-11T09:00:00.000Z',
    source: 'direct',
    created_at: '2026-11-11T08:30:00.000Z',
  },
  {
    id: 'app-002',
    name: 'ফারহানা ইসলাম',
    phone_normalized: '01822334455',
    occupation: 'ফ্রিল্যান্সার',
    area: 'শেওড়াপাড়া, ঢাকা',
    email: 'farhana.dev@example.com',
    interest: 'ফ্রিল্যান্সিংয়ের পাশাপাশি বহুমাত্রিক আয়ের কাঠামো কীভাবে গড়ে তোলা যায়।',
    payment_method: 'Nagad',
    payment_sender_phone: '01822334455',
    transaction_id: 'NGD7281940K',
    consent_version: 'v2',
    consented_at: '2026-11-11T09:15:00.000Z',
    status: 'interested',
    source: 'direct',
    created_at: '2026-11-11T09:15:00.000Z',
  },
];

/**
 * Retrieve all stored applicants from localStorage (merging v2 + legacy v1 keys) or return sample records.
 */
export function getStoredApplicants(): StoredApplicant[] {
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    const rawLegacy = localStorage.getItem(LEGACY_STORAGE_KEY);

    const parseSafe = (raw: string | null): StoredApplicant[] => {
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    };

    const listV2 = parseSafe(rawV2);
    const listLegacy = parseSafe(rawLegacy);

    if (listV2.length === 0 && listLegacy.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPLICANTS));
      return DEFAULT_APPLICANTS;
    }

    // Merge legacy records that aren't already present in v2
    const seenIds = new Set(listV2.map((item) => item.id));
    const merged = [
      ...listV2,
      ...listLegacy.filter((item) => !seenIds.has(item.id)),
    ];

    if (listLegacy.length > 0 && merged.length > listV2.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }

    return merged;
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return DEFAULT_APPLICANTS;
  }
}

/**
 * Save an applicant to local storage.
 */
export function saveApplicantLocally(data: RegistrationSubmission): StoredApplicant {
  const existing = getStoredApplicants();
  
  // Check duplicate by phone + transaction id
  const cleanTrx = data.transactionId.trim().toUpperCase();
  const duplicate = existing.find(
    (item) =>
      item.phone_normalized === data.phoneNormalized &&
      (item.transaction_id || '').toUpperCase() === cleanTrx
  );
  if (duplicate) {
    return duplicate;
  }

  const newApplicant: StoredApplicant = {
    id: 'app-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    name: data.name.trim(),
    phone_normalized: data.phoneNormalized,
    occupation: data.occupation,
    area: data.area.trim(),
    email: data.email?.trim() || null,
    interest: data.interest?.trim() || null,
    payment_method: data.paymentMethod,
    payment_sender_phone: data.paymentSenderPhone,
    transaction_id: cleanTrx,
    consent_version: 'v2',
    consented_at: new Date().toISOString(),
    status: 'interested',
    source: data.source || 'direct',
    created_at: new Date().toISOString(),
  };

  const updated = [newApplicant, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to write to localStorage:', err);
  }

  return newApplicant;
}

/**
 * Update applicant status in storage
 */
export function updateApplicantStatusLocally(
  id: string,
  newStatus: 'interested' | 'contacted' | 'confirmed' | 'cancelled'
): void {
  const existing = getStoredApplicants();
  const updated = existing.map((item) =>
    item.id === id
      ? { ...item, status: newStatus, status_updated_at: new Date().toISOString() }
      : item
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update status in localStorage:', err);
  }
}

/**
 * Submits registration. Saves locally and optionally syncs with Supabase.
 */
export async function submitRegistration(data: RegistrationSubmission): Promise<SubmissionResponse> {
  // Check honeypot spam
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return { success: true, message: 'registered' };
  }

  // Always save locally so no applicant is ever lost
  saveApplicantLocally(data);

  // If Supabase is configured, also sync to cloud database
  if (isBackendConfigured() && supabase) {
    try {
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
        p_payment_method: data.paymentMethod,
        p_payment_sender_phone: data.paymentSenderPhone,
        p_transaction_id: data.transactionId.trim().toUpperCase(),
      });

      if (!rpcError && rpcData?.success) {
        return { success: true, message: 'registered', duplicate: rpcData.duplicate };
      }
    } catch (cloudErr) {
      console.warn('Cloud sync error (locally safely stored):', cloudErr);
    }
  }

  return { success: true, message: 'registered' };
}
