import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MetricCard } from './components/MetricCard';
import { PaymentSimulator } from './components/PaymentSimulator';
import { TransactionList } from './components/TransactionList';
import { initialPayments, type DemoPayment } from './data/demo';
import { calculateMetrics } from './data/metrics';
import './styles/app.css';

const rupiah = new Intl.NumberFormat('id-ID');

function App() {
  const [payments, setPayments] = useState(initialPayments);
  const [volume, setVolume] = useState(82);

  const metrics = useMemo(() => calculateMetrics(payments), [payments]);

  const simulate = async (amountRupiah: number) => {
    const id = `demo-${Date.now()}`;
    const payment: DemoPayment = {
      id,
      providerReference: `RSK-${String(Date.now()).slice(-4)}`,
      amountRupiah,
      status: 'settled',
      announcementStatus: 'queued',
      receivedAt: new Date().toISOString(),
    };
    setPayments((current) => [payment, ...current]);

    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setPayments((current) =>
      current.map((item) => (item.id === id ? { ...item, announcementStatus: 'announced' } : item)),
    );
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/rispeak-mark.png" alt="" />
          <div>
            <strong>Rispeak</strong>
            <span>Payment voice console</span>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="demo-badge">Portfolio demo</span>
          <div className="device-pill">
            <i className="online" /> Speaker online
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Today at the counter</p>
            <h1>Dengar pembayaran masuk tanpa menatap layar.</h1>
            <p>Rispeak mengubah pembayaran terverifikasi menjadi konfirmasi suara yang jelas.</p>
          </div>
          <div className="hero-device">
            <span>Kasir utama</span>
            <strong>{volume}%</strong>
            <small>volume</small>
          </div>
        </section>

        <section className="metrics">
          <MetricCard
            label="Pembayaran settled"
            value={`Rp${rupiah.format(metrics.totalSettled)}`}
            detail="Nominal terverifikasi"
            accent
          />
          <MetricCard
            label="Sudah diumumkan"
            value={String(metrics.announced)}
            detail="Dikonfirmasi perangkat"
          />
          <MetricCard
            label="Dalam antrean"
            value={String(metrics.queued)}
            detail="Akan dicoba ulang"
          />
        </section>

        <PaymentSimulator onSubmit={simulate} />

        <section className="product-grid">
          <section className="panel device-panel">
            <div>
              <p className="eyebrow">Speaker profile</p>
              <h2>Kasir utama</h2>
              <p>Perangkat simulasi siap diganti dengan unit fisik saat prototipe tersedia.</p>
            </div>
            <label htmlFor="volume">Volume pengumuman</label>
            <input
              id="volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
            />
            <div className="device-facts">
              <span>
                Bahasa <strong>Indonesia</strong>
              </span>
              <span>
                Mode <strong>Settled only</strong>
              </span>
              <span>
                Retry <strong>Aktif</strong>
              </span>
            </div>
          </section>
          <section className="panel trust-panel">
            <p className="eyebrow">Product boundary</p>
            <h2>Demo yang aman untuk publik</h2>
            <p>
              Tampilan ini memakai data simulasi. Konektor merchant, device provisioning, aturan
              verifikasi, dan konfigurasi komersial disimpan di core privat.
            </p>
            <div className="trust-list">
              <span>✓ Tidak menyimpan kredensial pembayaran</span>
              <span>✓ Nominal diproses sebagai integer rupiah</span>
              <span>✓ Event duplikat tidak diumumkan ulang</span>
            </div>
          </section>
        </section>

        <TransactionList payments={payments} />
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
