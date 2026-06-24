import { KioskPerformance, MonthOption } from "../types/dashboard";

export interface OverviewMetrics {
  totalSessions: number;
  totalQuestions: number;
  averageQuestionsPerDay: number;
  successRate: number;
  apologyRate: number;
  averageRating: number;
}

export interface ComparedMetric {
  label: string;
  value: string;
  delta: number;
  tone: "good" | "bad" | "neutral";
  note: string;
}

const numberFormatter = new Intl.NumberFormat("en-US");

export function getMonthlyRows(rows: KioskPerformance[], monthId: string) {
  return rows.filter((row) => row.monthId === monthId);
}

export function getOverviewMetrics(rows: KioskPerformance[], month?: MonthOption): OverviewMetrics {
  const totalSessions = rows.reduce((sum, row) => sum + row.sessions, 0);
  const totalQuestions = rows.reduce((sum, row) => sum + row.questions, 0);
  const totalSuccess = rows.reduce((sum, row) => sum + row.successAnswers, 0);
  const totalApologies = rows.reduce((sum, row) => sum + row.apologyAnswers, 0);
  const ratingWeight = rows.reduce((sum, row) => sum + row.rating * row.sessions, 0);
  const days = month?.daysInMonth ?? 30;

  return {
    totalSessions,
    totalQuestions,
    averageQuestionsPerDay: totalQuestions / days,
    successRate: totalQuestions ? (totalSuccess / totalQuestions) * 100 : 0,
    apologyRate: totalQuestions ? (totalApologies / totalQuestions) * 100 : 0,
    averageRating: totalSessions ? ratingWeight / totalSessions : 0
  };
}

export function percentDelta(current: number, previous: number) {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function formatNumber(value: number) {
  return numberFormatter.format(Math.round(value));
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatRating(value: number) {
  return `${value.toFixed(1)}/5`;
}

export function buildComparedMetrics(current: OverviewMetrics, previous: OverviewMetrics): ComparedMetric[] {
  return [
    {
      label: "Total sessions",
      value: formatNumber(current.totalSessions),
      delta: percentDelta(current.totalSessions, previous.totalSessions),
      tone: "good",
      note: "All kiosk interactions (Sum of daily sessions from kiosk performance logs)"
    },
    {
      label: "Total questions",
      value: formatNumber(current.totalQuestions),
      delta: percentDelta(current.totalQuestions, previous.totalQuestions),
      tone: "good",
      note: "Questions asked by users (Sum of questions from raw performance logs)"
    },
    {
      label: "Avg. questions/day",
      value: formatNumber(current.averageQuestionsPerDay),
      delta: percentDelta(current.averageQuestionsPerDay, previous.averageQuestionsPerDay),
      tone: "good",
      note: "Monthly pacing (Total questions / Days in month)"
    },
    {
      label: "Success rate",
      value: formatPercent(current.successRate),
      delta: current.successRate - previous.successRate,
      tone: "good",
      note: "Answered without apology (Success answers / Total questions × 100)"
    },
    {
      label: "Apology/error rate",
      value: formatPercent(current.apologyRate),
      delta: current.apologyRate - previous.apologyRate,
      tone: "bad",
      note: "Needs content or model review (Apology answers / Total questions × 100)"
    },
    {
      label: "Average rating",
      value: formatRating(current.averageRating),
      delta: current.averageRating - previous.averageRating,
      tone: "good",
      note: "Weighted by sessions (Sum of (Rating × Sessions) / Total Sessions)"
    }
  ];
}

export function getPreviousMonthId(months: MonthOption[], monthId: string) {
  const index = months.findIndex((month) => month.id === monthId);
  return months[index + 1]?.id ?? months[index]?.id ?? monthId;
}
