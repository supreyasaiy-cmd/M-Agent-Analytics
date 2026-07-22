import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildPerformanceReportData
} from "./generate-performance-report-data.mjs";

function parseGeneratedPayload(rootDir) {
  const filePath = join(rootDir, "outputs", "assets", "performance-report-data.js");
  const raw = readFileSync(filePath, "utf8");
  const prefix = "window.__PERFORMANCE_REPORT_DATA__ = ";
  if (!raw.startsWith(prefix)) {
    throw new Error("Generated performance data file has an unexpected format.");
  }
  return JSON.parse(raw.slice(prefix.length, raw.lastIndexOf(";")));
}

function sumMonthMetrics(monthMetrics = {}) {
  return Object.values(monthMetrics).reduce(
    (totals, row) => {
      totals.sessions += Number(row?.[0] || 0);
      totals.questions += Number(row?.[1] || 0);
      return totals;
    },
    { sessions: 0, questions: 0 }
  );
}

function assertEqual(label, actual, expected, mismatches) {
  if (actual !== expected) {
    mismatches.push(`${label}: expected ${expected}, got ${actual}`);
  }
}

function validatePerformanceReportData(rootDir = process.cwd()) {
  const direct = buildPerformanceReportData(rootDir);
  const generated = parseGeneratedPayload(rootDir);
  const mismatches = [];

  const months = Array.from(
    new Set([
      ...Object.keys(direct.csvMachineMetrics || {}),
      ...Object.keys(generated.csvMachineMetrics || {})
    ])
  ).sort();

  for (const monthId of months) {
    const directTotals = sumMonthMetrics(direct.csvMachineMetrics?.[monthId]);
    const generatedTotals = sumMonthMetrics(generated.csvMachineMetrics?.[monthId]);
    assertEqual(`${monthId} sessions`, generatedTotals.sessions, directTotals.sessions, mismatches);
    assertEqual(`${monthId} questions`, generatedTotals.questions, directTotals.questions, mismatches);
  }

  const directOverall = months.reduce(
    (totals, monthId) => {
      const monthTotals = sumMonthMetrics(direct.csvMachineMetrics?.[monthId]);
      totals.sessions += monthTotals.sessions;
      totals.questions += monthTotals.questions;
      return totals;
    },
    { sessions: 0, questions: 0 }
  );

  const generatedOverall = months.reduce(
    (totals, monthId) => {
      const monthTotals = sumMonthMetrics(generated.csvMachineMetrics?.[monthId]);
      totals.sessions += monthTotals.sessions;
      totals.questions += monthTotals.questions;
      return totals;
    },
    { sessions: 0, questions: 0 }
  );

  assertEqual("overall sessions", generatedOverall.sessions, directOverall.sessions, mismatches);
  assertEqual("overall questions", generatedOverall.questions, directOverall.questions, mismatches);

  const directEvents = new Map((direct.eventHistory || []).map(event => [event.event, event.performance]));
  const generatedEvents = new Map((generated.eventHistory || []).map(event => [event.event, event.performance]));
  const allEvents = Array.from(new Set([...directEvents.keys(), ...generatedEvents.keys()])).sort();

  for (const eventName of allEvents) {
    assertEqual(
      `event ${eventName}`,
      generatedEvents.get(eventName) || "",
      directEvents.get(eventName) || "",
      mismatches
    );
  }

  if (mismatches.length) {
    throw new Error(`Performance data validation failed:\n- ${mismatches.join("\n- ")}`);
  }

  return {
    months,
    overall: generatedOverall,
    latestMonth: months.at(-1) || null,
    eventCount: allEvents.length
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = validatePerformanceReportData(process.cwd());
  console.log(
    `Validated ${result.months.length} months, ${result.eventCount} events, ` +
      `${result.overall.sessions} sessions, ${result.overall.questions} questions.`
  );
}

export { validatePerformanceReportData };
