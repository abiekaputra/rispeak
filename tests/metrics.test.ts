import { describe, expect, it } from 'vitest';
import type { DemoPayment } from '../src/data/demo';
import { calculateMetrics } from '../src/data/metrics';

describe('calculateMetrics', () => {
  it('summarizes settled amount and announcement states', () => {
    const payments: DemoPayment[] = [
      {
        id: '1',
        providerReference: 'RSK-1',
        amountRupiah: 10_000,
        status: 'settled',
        announcementStatus: 'announced',
        receivedAt: new Date().toISOString(),
      },
      {
        id: '2',
        providerReference: 'RSK-2',
        amountRupiah: 25_000,
        status: 'settled',
        announcementStatus: 'queued',
        receivedAt: new Date().toISOString(),
      },
    ];

    expect(calculateMetrics(payments)).toEqual({
      totalSettled: 35_000,
      announced: 1,
      queued: 1,
    });
  });
});
