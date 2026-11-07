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

export interface StoredApplicant {
  id: string;
  name: string;
  phone_normalized: string;
  occupation: string;
  area: string;
  email: string | null;
  interest: string | null;
  consent_version: string;
  consented_at: string;
  status: 'interested' | 'contacted' | 'confirmed' | 'cancelled';
  status_updated_at?: string | null;
  source: string;
  created_at: string;
}

const STORAGE_KEY = 'biniyog_adda_applications_v1';

// Initial preloaded sample applications so the admin can test immediately
const DEFAULT_APPLICANTS: StoredApplicant[] = [
  {
    id: 'app-001',
    name: 'তানভীর আহমেদ',
    phone_normalized: '01711223344',
    occupation: 'চাকরিজীবী',
    area: 'ধানমন্ডি, ঢাকা',
    email: 'tanvir.ahmed@example.com',
    interest: 'চাকরির পাশাপাশি ডিজিটাল অ্যাসেট ও পরোক্ষ আয়ের কাঠামো কীভাবে শুরু করব তা বিস্তারিত জানতে চাই।',
    consent_version: 'v1',
    consented_at: '2026-11-07T08:30:00.000Z',
    status: 'interested',
    source: 'direct',
    created_at: '2026-11-07T08:30:00.000Z',
  },
  {
    id: 'app-002',
    name: 'ফারহানা ইসলাম',
    phone_normalized: '01822334455',
    occupation: 'ফ্রিল্যান্সার',
    area: 'মিরপুর, ঢাকা',
    email: 'farhana.dev@example.com',
    interest: 'শুধুমাত্র ক্লায়েন্ট সার্ভিসের বাইরে কীভাবে স্থায়ী ডিজিটাল রিসোর্স বা প্রোডাক্ট বানিয়ে নিয়মিত ক্যাশ-ফ্লো আনা যায়।',
    consent_version: 'v1',
    consented_at: '2026-11-07T09:15:00.000Z',
    status: 'contacted',
    status_updated_at: '2026-11-07T10:00:00.000Z',
    source: 'direct',
    created_at: '2026-11-07T09:15:00.000Z',
  },
  {
    id: 'app-003',
    name: 'মাহমুদুল হক',
    phone_normalized: '01933445566',
    occupation: 'ব্যবসায়ী বা উদ্যোক্তা',
    area: 'উত্তরা, ঢাকা',
    email: 'mahmud.trade@example.com',
    interest: 'ব্যবসার অতিরিক্ত লাভ দিয়ে ঝুঁকিহীন বা সীমিত ঝুঁকির বহুমুখী আয়ের পোর্টফোলিও বানানোর উপায়।',
    consent_version: 'v1',
    consented_at: '2026-11-07T10:45:00.000Z',
    status: 'confirmed',
    status_updated_at: '2026-11-07T11:20:00.000Z',
    source: 'direct',
    created_at: '2026-11-07T10:45:00.000Z',
  },
];

/**
 * Retrieve all stored applicants from localStorage or return default demo records.
 */
export function getStoredApplicants(): StoredApplicant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPLICANTS));
      return DEFAULT_APPLICANTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_APPLICANTS;
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
  
  // Check duplicate
  const duplicate = existing.find((item) => item.phone_normalized === data.phoneNormalized);
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
    consent_version: 'v1',
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
