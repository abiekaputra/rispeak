import { describe, expect, it } from 'vitest';
import { formatPaymentAnnouncement, spellRupiah } from '../src/services/announcement';

describe('spellRupiah', () => {
  it.each([
    [11, 'sebelas'],
    [15, 'lima belas'],
    [100, 'seratus'],
    [1_000, 'seribu'],
    [61_500, 'enam puluh satu ribu lima ratus'],
    [1_250_000, 'satu juta dua ratus lima puluh ribu'],
  ])('spells %i as Indonesian words', (amount, expected) => {
    expect(spellRupiah(amount)).toBe(expected);
  });

  it('rejects invalid payment amounts', () => {
    expect(() => spellRupiah(0)).toThrow('positive integer');
    expect(() => spellRupiah(10.5)).toThrow('positive integer');
  });
});

describe('formatPaymentAnnouncement', () => {
  it('creates a concise payment sentence', () => {
    expect(formatPaymentAnnouncement(24_000)).toBe(
      'Rispeak. Pembayaran diterima sebesar dua puluh empat ribu rupiah.',
    );
  });
});
