export type DemoStatus = 'announced' | 'queued';

export interface DemoPayment {
  id: string;
  providerReference: string;
  amountRupiah: number;
  status: 'settled';
  announcementStatus: DemoStatus;
  receivedAt: string;
}

const now = Date.now();

export const initialPayments: DemoPayment[] = [
  {
    id: 'demo-3',
    providerReference: 'RSK-2048',
    amountRupiah: 78_500,
    status: 'settled',
    announcementStatus: 'announced',
    receivedAt: new Date(now - 3 * 60_000).toISOString(),
  },
  {
    id: 'demo-2',
    providerReference: 'RSK-1984',
    amountRupiah: 24_000,
    status: 'settled',
    announcementStatus: 'announced',
    receivedAt: new Date(now - 18 * 60_000).toISOString(),
  },
  {
    id: 'demo-1',
    providerReference: 'RSK-1937',
    amountRupiah: 36_500,
    status: 'settled',
    announcementStatus: 'announced',
    receivedAt: new Date(now - 34 * 60_000).toISOString(),
  },
];
