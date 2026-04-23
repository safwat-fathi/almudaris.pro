const LOCALE = 'ar-EG';

export function formatCurrency(amount: number): string {
  // Format as EGP (Egyptian Pound)
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace('ج.م.', 'ج.م'); 
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE, options).format(value);
}

export function formatPercentage(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'percent',
    maximumFractionDigits: 0,
    ...options
  }).format(value);
}

export function formatDate(
  date: Date | string | number, 
  options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(LOCALE, options).format(d);
}

/**
 * Normalizes a PostgreSQL 'time with time zone' string (e.g., "23:00:00+02" or "23:00:00.000+02:00")
 * to just the "HH:mm:ss" part so it can be appended to a date string and parsed safely by new Date().
 */
export function normalizeTimeString(timeStr: string): string {
  if (!timeStr) return "00:00:00";
  // The first 8 characters will usually be HH:mm:ss
  // We handle potential edge cases (like "23:00" without seconds) by splitting or taking substring
  const clean = timeStr.split(/[+.-]/)[0];
  // If it was just "23:00", we pad it
  if (clean.length === 5) return `${clean}:00`;
  return clean.substring(0, 8);
}

/**
 * Extracts the "HH:mm" part of a time string for clean UI presentation, stripping seconds and timezone.
 */
export function formatTimeUI(timeStr: string): string {
  if (!timeStr) return "";
  const normalized = normalizeTimeString(timeStr);
  return normalized.substring(0, 5); // Just "HH:mm"
}

