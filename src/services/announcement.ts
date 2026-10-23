const smallNumbers = [
  'nol',
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
  'sepuluh',
  'sebelas',
] as const;

function spellPositiveInteger(value: number): string {
  if (value < 12) return smallNumbers[value];
  if (value < 20) return `${spellPositiveInteger(value - 10)} belas`;
  if (value < 100) {
    const remainder = value % 10;
    return `${spellPositiveInteger(Math.floor(value / 10))} puluh${remainder ? ` ${spellPositiveInteger(remainder)}` : ''}`;
  }
  if (value < 200) return `seratus${value > 100 ? ` ${spellPositiveInteger(value - 100)}` : ''}`;
  if (value < 1_000) {
    const remainder = value % 100;
    return `${spellPositiveInteger(Math.floor(value / 100))} ratus${remainder ? ` ${spellPositiveInteger(remainder)}` : ''}`;
  }
  if (value < 2_000)
    return `seribu${value > 1_000 ? ` ${spellPositiveInteger(value - 1_000)}` : ''}`;
  if (value < 1_000_000) return spellScale(value, 1_000, 'ribu');
  if (value < 1_000_000_000) return spellScale(value, 1_000_000, 'juta');
  if (value < 1_000_000_000_000) return spellScale(value, 1_000_000_000, 'miliar');
  return spellScale(value, 1_000_000_000_000, 'triliun');
}

function spellScale(value: number, scale: number, label: string): string {
  const remainder = value % scale;
  const leading = spellPositiveInteger(Math.floor(value / scale));
  return `${leading} ${label}${remainder ? ` ${spellPositiveInteger(remainder)}` : ''}`;
}

export function spellRupiah(amountRupiah: number): string {
  if (!Number.isSafeInteger(amountRupiah) || amountRupiah <= 0) {
    throw new Error('Payment amount must be a positive integer.');
  }
  return spellPositiveInteger(amountRupiah);
}

export function formatPaymentAnnouncement(amountRupiah: number): string {
  return `Rispeak. Pembayaran diterima sebesar ${spellRupiah(amountRupiah)} rupiah.`;
}
