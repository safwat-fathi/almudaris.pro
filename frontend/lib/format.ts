export function formatCurrency(amount: number): string {
  // Format as EGP (Egyptian Pound)
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace('ج.م.', 'ج.م'); 
}
