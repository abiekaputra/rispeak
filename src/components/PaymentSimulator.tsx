import { useState } from 'react';

interface PaymentSimulatorProps {
  onSubmit: (amount: number) => Promise<void>;
}

export function PaymentSimulator({ onSubmit }: PaymentSimulatorProps) {
  const [amount, setAmount] = useState('42500');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Gunakan simulasi sebelum perangkat fisik tersedia.');

  const submit = async () => {
    const parsed = Number(amount);
    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
      setMessage('Masukkan nominal rupiah yang valid.');
      return;
    }
    setBusy(true);
    try {
      await onSubmit(parsed);
      setMessage(`Pembayaran Rp${parsed.toLocaleString('id-ID')} berhasil diumumkan.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Simulasi gagal.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel simulator-panel">
      <div>
        <p className="eyebrow">Payment lab</p>
        <h2>Uji pengumuman tanpa QRIS asli</h2>
        <p>Browser akan mengucapkan nominal dan menyelesaikan event setelah suara berakhir.</p>
      </div>
      <div className="amount-control">
        <label htmlFor="amount">Nominal pembayaran</label>
        <div className="amount-input">
          <span>Rp</span>
          <input
            id="amount"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value.replace(/\D/g, ''))}
          />
        </div>
        <button type="button" onClick={() => void submit()} disabled={busy}>
          {busy ? 'Mengirim…' : 'Simulasikan pembayaran'}
        </button>
        <p className="helper" role="status">
          {message}
        </p>
      </div>
    </section>
  );
}
