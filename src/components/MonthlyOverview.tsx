import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  MessageSquareText,
  Star
} from "lucide-react";
import { ComparedMetric } from "../utils/metrics";

const icons = [Activity, MessageSquareText, CalendarDays, BarChart3, AlertTriangle, Star];

interface MonthlyOverviewProps {
  metrics: ComparedMetric[];
  comparisonLabel: string;
}

export function MonthlyOverview({ metrics, comparisonLabel }: MonthlyOverviewProps) {
  return (
    <section className="overview-grid" aria-label="Monthly overview">
      {metrics.map((metric, index) => {
        const Icon = icons[index] ?? Activity;
        const isBadMetric = metric.tone === "bad";
        const improved = isBadMetric ? metric.delta <= 0 : metric.delta >= 0;
        const deltaClass = improved ? "delta-positive" : "delta-negative";
        const sign = metric.delta > 0 ? "+" : "";

        return (
          <article className="metric-card" key={metric.label}>
            <div className="metric-card__top">
              <span className="metric-icon">
                <Icon size={18} />
              </span>
              <span className={deltaClass}>
                {sign}
                {metric.delta.toFixed(1)}%
              </span>
            </div>
            <strong>{metric.value}</strong>
            <div>
              <p>{metric.label}</p>
              <span>{metric.note}</span>
            </div>
            <small>vs {comparisonLabel}</small>
          </article>
        );
      })}
    </section>
  );
}
