/**
 * Bengali digit to English digit conversion map
 */
const BENGALI_DIGITS_MAP: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

/**
 * Normalizes any Bangladeshi phone number input into the canonical 11-digit `01XXXXXXXXX` format.
 * - Converts Bengali digits to English
 * - Strips whitespace, dashes, brackets
 * - Strips leading '+88' or '88'
 */
export function normalizePhoneNumber(raw: string): string {
  if (!raw) return '';

  // 1. Convert Bengali numerals to Western Arabic numerals
  let converted = raw.replace(/[০-৯]/g, (digit) => BENGALI_DIGITS_MAP[digit] || digit);

  // 2. Strip all spaces, dashes, dots, parentheses
  let digitsOnly = converted.replace(/[\s\-\(\)\.]/g, '');

  // 3. Remove leading +880 or 880 prefix
  if (digitsOnly.startsWith('+880')) {
    digitsOnly = '0' + digitsOnly.slice(4);
  } else if (digitsOnly.startsWith('880')) {
    digitsOnly = '0' + digitsOnly.slice(3);
  } else if (digitsOnly.startsWith('+88')) {
    digitsOnly = digitsOnly.slice(3);
  } else if (digitsOnly.startsWith('88') && digitsOnly.length === 13) {
    digitsOnly = digitsOnly.slice(2);
  }

  return digitsOnly;
}

/**
 * Validates canonical Bangladeshi mobile number:
 * Starts with 01, followed by 3-9, followed by 8 digits (total 11 digits)
 */
export function isValidBdMobile(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return /^01[3-9][0-9]{8}$/.test(normalized);
}

/**
 * Format phone for display
 */
export function formatBdPhoneDisplay(normalized: string): string {
  if (normalized.length === 11) {
    return `${normalized.slice(0, 5)} ${normalized.slice(5, 8)} ${normalized.slice(8)}`;
  }
  return normalized;
}
