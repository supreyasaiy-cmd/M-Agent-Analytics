import { buildPerformanceReportData } from "./generate-performance-report-data.mjs";

function sumMonthMetrics(monthMetrics = {}) {
  return Object.entries(monthMetrics).reduce(
    (totals, [assetId, row]) => {
      totals.sessions += Number(row?.[0] || 0);
      totals.questions += Number(row?.[1] || 0);
      totals.byAsset.push({
        assetId,
        sessions: Number(row?.[0] || 0),
        questions: Number(row?.[1] || 0),
        success: Number(row?.[9] || 0),
        apology: Number(row?.[10] || 0),
        rating: row?.length > 11 ? Number(row?.[11] || 0) : null
      });
      return totals;
    },
    { sessions: 0, questions: 0, byAsset: [] }
  );
}

function toPct(num, den) {
  return den > 0 ? `${((num / den) * 100).toFixed(1)}%` : "0.0%";
}

function formatRating(rows) {
  const rated = rows.filter(row => Number.isFinite(row.rating) && row.rating > 0);
  if (!rated.length) return "—";
  const totalSessions = rated.reduce((sum, row) => sum + row.sessions, 0);
  if (!totalSessions) return "—";
  const weighted = rated.reduce((sum, row) => sum + row.rating * row.sessions, 0) / totalSessions;
  return weighted.toFixed(2);
}

function auditDashboardData(rootDir = process.cwd()) {
  const payload = buildPerformanceReportData(rootDir);
  const monthIds = Object.keys(payload.csvMachineMetrics || {}).sort();

  const rows = monthIds.map(monthId => {
    const totals = sumMonthMetrics(payload.csvMachineMetrics?.[monthId]);
    const success = totals.byAsset.reduce((sum, row) => sum + row.success, 0);
    const apology = totals.byAsset.reduce((sum, row) => sum + row.apology, 0);
    const activeMachines = totals.byAsset.filter(row => row.sessions > 0 || row.questions > 0).length;
    const meta = payload.monthMeta?.[monthId] || {};
    return {
      month: monthId,
      coverageStart: meta.coverageStart || "—",
      coverageEnd: meta.coverageEnd || "—",
      sessions: totals.sessions,
      questions: totals.questions,
      activeMachines,
      successRate: toPct(success, totals.questions),
      apologyRate: toPct(apology, totals.questions),
      rating: formatRating(totals.byAsset)
    };
  });

  console.table(rows);

  const grand = rows.reduce(
    (totals, row) => {
      totals.sessions += row.sessions;
      totals.questions += row.questions;
      return totals;
    },
    { sessions: 0, questions: 0 }
  );

  console.log(
    `Grand total: ${grand.sessions.toLocaleString("en-US")} sessions, ` +
      `${grand.questions.toLocaleString("en-US")} questions`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  auditDashboardData(process.cwd());
}

export { auditDashboardData };
