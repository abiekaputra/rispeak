import type { DemoPayment } from '../data/demo';

interface TransactionListProps {
  payments: DemoPayment[];
}

const rupiah = new Intl.NumberFormat('id-ID');

export function TransactionList({ payments }: TransactionListProps) {
  return (
    <section className="panel transactions-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Recent activity</p>
          <h2>Riwayat pembayaran</h2>
        </div>
        <span className="live-chip">Live</span>
      </div>
      <div className="transaction-list">
        {payments.length === 0 ? (
          <div className="empty-state">Belum ada pembayaran. Jalankan simulasi pertama.</div>
        ) : (
          payments.map((payment) => (
            <article className="transaction" key={payment.id}>
              <div className="transaction-icon">✓</div>
              <div>
                <strong>Rp{rupiah.format(payment.amountRupiah)}</strong>
                <span>{payment.providerReference}</span>
              </div>
              <div className="transaction-status">
                <span className={`status status--${payment.announcementStatus ?? 'silent'}`}>
                  {payment.announcementStatus ?? payment.status}
                </span>
                <time>{new Date(payment.receivedAt).toLocaleTimeString('id-ID')}</time>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
