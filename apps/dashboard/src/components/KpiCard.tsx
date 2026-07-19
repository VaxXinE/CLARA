import type { KpiDashboardResponse } from "../api/types";

type KpiCardProps = {
  card: KpiDashboardResponse["cards"][number];
};

function formatValue(value: number | string): string {
  return typeof value === "number" ? value.toLocaleString("en-US") : value;
}

export function KpiCard({ card }: KpiCardProps) {
  return (
    <article className="state-card" aria-label={card.label}>
      <span className="badge">{card.severity}</span>
      <h3>{card.label}</h3>
      <strong>{formatValue(card.value)}</strong>
      <p>{card.description}</p>
      <small>
        {card.category} · {card.source}
      </small>
    </article>
  );
}
