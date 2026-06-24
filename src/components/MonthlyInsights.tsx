import { Lightbulb, MapPinned, TrendingUp } from "lucide-react";
import { ErrorLog, EventBorrowing, Kiosk, KioskPerformance, TopicMetric } from "../types/dashboard";
import { formatNumber, formatPercent } from "../utils/metrics";

interface MonthlyInsightsProps {
  kiosks: Kiosk[];
  performance: KioskPerformance[];
  topics: TopicMetric[];
  errors: ErrorLog[];
  events: EventBorrowing[];
}

export function MonthlyInsights({ kiosks, performance, topics, errors, events }: MonthlyInsightsProps) {
  const kioskMap = new Map(kiosks.map((kiosk) => [kiosk.assetId, kiosk]));
  const highest = [...performance].sort((a, b) => b.questions - a.questions)[0];
  const lowest = [...performance].sort((a, b) => a.sessions - b.sessions)[0];
  const topTopic = [...topics].sort((a, b) => b.questions - a.questions)[0];
  const openErrors = errors.filter((error) => error.status !== "Fixed");
  const eventWinner = events[0];

  const insights = [
    {
      icon: TrendingUp,
      title: "Highest engagement",
      text: highest
        ? `${kioskMap.get(highest.assetId)?.currentLocation ?? highest.assetId} generated ${formatNumber(highest.questions)} questions with ${formatPercent((highest.successAnswers / highest.questions) * 100)} success.`
        : "No kiosk performance data available."
    },
    {
      icon: MapPinned,
      title: "Relocation candidate",
      text: lowest
        ? `${lowest.assetId} has the lowest session volume at ${formatNumber(lowest.sessions)} sessions. Review foot traffic or move closer to promotion zones.`
        : "No kiosk volume data available."
    },
    {
      icon: Lightbulb,
      title: "KM update priority",
      text: topTopic
        ? `${topTopic.category} is the top topic with ${formatNumber(topTopic.questions)} questions. Keep campaign, M Card, and directory content fresh.`
        : "No topic data available."
    },
    {
      icon: Lightbulb,
      title: "Open answer gaps",
      text: `${openErrors.length} knowledge gaps remain open. Prioritize missing parking, store hours, and active event location answers.`
    },
    {
      icon: TrendingUp,
      title: "Event impact",
      text: eventWinner
        ? `${eventWinner.eventName} produced ${eventWinner.performanceDuringEvent}; event borrowing is worth tracking as a growth driver.`
        : "No event borrowing recorded for this month."
    }
  ];

  return (
    <section className="panel insights-panel">
      <div className="panel-header">
        <div>
          <h2>Monthly insights</h2>
          <p>Auto-generated management summary from kiosk, topic, event, and error data.</p>
        </div>
      </div>
      <div className="insight-grid">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <article key={insight.title}>
              <Icon size={18} />
              <div>
                <strong>{insight.title}</strong>
                <p>{insight.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
