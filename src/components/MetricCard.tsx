interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}

export function MetricCard({ label, value, detail, accent = false }: MetricCardProps) {
  return (
    <article className={`metric-card${accent ? ' metric-card--accent' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
