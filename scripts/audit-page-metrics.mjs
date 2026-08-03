import { buildPerformanceReportData } from "./generate-performance-report-data.mjs";

const kiosks = [
  { assetId: "NO1-M8-BKP-01", machine: "TheMall-001", location: "M8 Bangkapi - Information Counter (G)", screen: '43 in' },
  { assetId: "NO2-M7-BKE-01", machine: "TheMall-002", location: "M8 Bangkapi - E-Stamp (G)", screen: '43 in' },
  { assetId: "NO3-M6-NGW-01", machine: "TheMall-003", location: "M8 Bangkapi - Bank Zone ชั้น 2", screen: '43 in' },
  { assetId: "NO4-M5-THA-01", machine: "TheMall-004", location: "M8 Bangkapi - Platinum Lounge ชั้น 2", screen: '43 in' },
  { assetId: "NO5-M3-EVT-01", machine: "TheMall-005", location: "M8 Bangkapi - Dining Zone ชั้น 3", screen: '55 in' }
];

function metricFromMonthRows(monthMetrics = {}, dayCount = 30) {
  const rows = Object.values(monthMetrics);
  const sessions = rows.reduce((sum, row) => sum + Number(row?.[0] || 0), 0);
  const questions = rows.reduce((sum, row) => sum + Number(row?.[1] || 0), 0);
  const success = rows.reduce((sum, row) => sum + Number(row?.[9] || 0), 0);
  const apology = rows.reduce((sum, row) => sum + Number(row?.[10] || 0), 0);
  const ratedRows = rows.filter(row => row?.length > 11 && Number.isFinite(Number(row?.[11])));
  const ratedSessionTotal = ratedRows.reduce((sum, row) => sum + Number(row?.[0] || 0), 0);
  const rating = ratedSessionTotal
    ? ratedRows.reduce((sum, row) => sum + Number(row[11] || 0) * Number(row[0] || 0), 0) / ratedSessionTotal
    : null;
  return {
    sessions,
    questions,
    successRate: questions ? (success / questions) * 100 : 0,
    apologyRate: questions ? (apology / questions) * 100 : 0,
    rating,
    avgQuestionsPerDay: dayCount ? questions / dayCount : 0,
    activeMachines: Object.values(monthMetrics).filter(row => Number(row?.[0] || 0) > 0 || Number(row?.[1] || 0) > 0).length
  };
}

function aggregateAsset(payload, assetId, monthIds) {
  let sessions = 0;
  let questions = 0;
  let success = 0;
  let apology = 0;
  let weightedRating = 0;
  let ratedSessions = 0;
  let coveredDays = 0;

  for (const monthId of monthIds) {
    const row = payload.csvMachineMetrics?.[monthId]?.[assetId];
    if (!row) continue;
    sessions += Number(row?.[0] || 0);
    questions += Number(row?.[1] || 0);
    success += Number(row?.[9] || 0);
    apology += Number(row?.[10] || 0);
    if (row.length > 11 && Number.isFinite(Number(row[11]))) {
      weightedRating += Number(row[11]) * Number(row[0] || 0);
      ratedSessions += Number(row[0] || 0);
    }
    const meta = payload.monthMeta?.[monthId];
    if (meta?.coverageStart && meta?.coverageEnd) {
      const start = new Date(`${meta.coverageStart}T00:00:00`);
      const end = new Date(`${meta.coverageEnd}T00:00:00`);
      coveredDays += Math.max(1, Math.round((end - start) / 86400000) + 1);
    }
  }

  return {
    assetId,
    sessions,
    questions,
    successRate: questions ? (success / questions) * 100 : 0,
    apologyRate: questions ? (apology / questions) * 100 : 0,
    rating: ratedSessions ? weightedRating / ratedSessions : null,
    avgSessionsPerDay: coveredDays ? sessions / coveredDays : 0,
    qps: sessions ? questions / sessions : 0
  };
}

function buildRecommendationSnapshot(payload) {
  const monthIds = Object.keys(payload.csvMachineMetrics || {}).sort();
  const totalDays = monthIds.reduce((sum, monthId) => {
    const meta = payload.monthMeta?.[monthId];
    if (!meta?.coverageStart || !meta?.coverageEnd) return sum;
    const start = new Date(`${meta.coverageStart}T00:00:00`);
    const end = new Date(`${meta.coverageEnd}T00:00:00`);
    return sum + Math.max(1, Math.round((end - start) / 86400000) + 1);
  }, 0);

  return kiosks.map(kiosk => {
    const row = aggregateAsset(payload, kiosk.assetId, monthIds);
    return {
      assetId: kiosk.assetId,
      machine: kiosk.machine,
      sessions: row.sessions,
      questions: row.questions,
      avgSessionsPerDay: Number(row.avgSessionsPerDay.toFixed(1)),
      questionsPerSession: Number(row.qps.toFixed(2)),
      successRate: `${row.successRate.toFixed(1)}%`,
      rating: row.rating === null ? "—" : row.rating.toFixed(2),
      window: `${monthIds[0]} to ${monthIds.at(-1)}`,
      totalDays
    };
  });
}

function auditPageMetrics(rootDir = process.cwd()) {
  const payload = buildPerformanceReportData(rootDir);
  const latestMonth = Object.keys(payload.csvMachineMetrics || {}).sort().at(-1);
  const latestMeta = payload.monthMeta?.[latestMonth] || {};
  const latestRaw = payload.rawMonthlyMetrics?.[latestMonth] || null;
  const latest = latestRaw
    ? {
        sessions: Number(latestRaw.sessions || 0),
        questions: Number(latestRaw.questions || 0),
        successRate: Number(latestRaw.questions || 0) ? (Number(latestRaw.success || 0) / Number(latestRaw.questions || 0)) * 100 : 0,
        apologyRate: Number(latestRaw.questions || 0) ? (Number(latestRaw.apology || 0) / Number(latestRaw.questions || 0)) * 100 : 0,
        rating: latestRaw.rating === null || latestRaw.rating === undefined ? null : Number(latestRaw.rating),
        activeMachines: Number(latestRaw.activeMachines || 0)
      }
    : metricFromMonthRows(payload.csvMachineMetrics?.[latestMonth], 30);

  console.log("\nOverview snapshot");
  console.table([
    {
      month: latestMonth,
      coverageStart: latestMeta.coverageStart || "—",
      coverageEnd: latestMeta.coverageEnd || "—",
      sessions: latest.sessions,
      questions: latest.questions,
      successRate: `${latest.successRate.toFixed(1)}%`,
      apologyRate: `${latest.apologyRate.toFixed(1)}%`,
      rating: latest.rating === null ? "—" : latest.rating.toFixed(2),
      activeMachines: latest.activeMachines
    }
  ]);

  console.log("\nMachine Status snapshot");
  console.table(
    kiosks.map(kiosk => {
      const row = payload.csvMachineMetrics?.[latestMonth]?.[kiosk.assetId] || [];
      const questions = Number(row?.[1] || 0);
      const success = questions ? (Number(row?.[9] || 0) / questions) * 100 : 0;
      const meta = payload.monthMeta?.[latestMonth];
      const days = meta?.coverageStart && meta?.coverageEnd
        ? Math.max(1, Math.round((new Date(`${meta.coverageEnd}T00:00:00`) - new Date(`${meta.coverageStart}T00:00:00`)) / 86400000) + 1)
        : 30;
      return {
        assetId: kiosk.assetId,
        sessions: Number(row?.[0] || 0),
        avgSessionsPerDay: Number((Number(row?.[0] || 0) / days).toFixed(1)),
        successRate: `${success.toFixed(1)}%`,
        rating: row.length > 11 ? Number(row[11] || 0).toFixed(1) : "—"
      };
    })
  );

  console.log("\nRecommendation snapshot");
  console.table(buildRecommendationSnapshot(payload));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  auditPageMetrics(process.cwd());
}

export { auditPageMetrics };
