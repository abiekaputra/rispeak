import type { DemoPayment } from './demo';

export function calculateMetrics(payments: DemoPayment[]) {
  return {
    totalSettled: payments.reduce((sum, payment) => sum + payment.amountRupiah, 0),
    announced: payments.filter((payment) => payment.announcementStatus === 'announced').length,
    queued: payments.filter((payment) => payment.announcementStatus === 'queued').length,
  };
}
