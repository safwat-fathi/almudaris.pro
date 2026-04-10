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
