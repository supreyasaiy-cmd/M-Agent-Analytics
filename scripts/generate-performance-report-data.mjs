import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import Papa from "papaparse";

const reportFiles = {
  "2025-09": {
    message: "Perfomance Reports/0925 Sep/09 M Agent_SEP.csv"
  },
  "2025-10": {
    message: "Perfomance Reports/1025 Oct/messageLog-export-2025-10-15-to-2025-10-31-98d08b98.csv",
    rating: "Perfomance Reports/1025 Oct/ratings-export-2025-10-15-to-2025-10-31-98d08b98.csv"
  },
  "2025-11": {
    message: "Perfomance Reports/1125 Nov/messageLog-export-2025-11-01-to-2025-11-30-bf667c21.csv",
    rating: "Perfomance Reports/1125 Nov/ratings-export-2025-11-01-to-2025-11-30-bf667c21.csv"
  },
  "2025-12": {
    message: "Perfomance Reports/1225 Dec/messageLog-export-2025-12-01-to-2025-12-31-0443aded.csv",
    rating: "Perfomance Reports/1225 Dec/ratings-export-2025-12-01-to-2025-12-31-0443aded.csv"
  },
  "2026-01": {
    message: "Perfomance Reports/0126 Jan/messageLog-export-2026-01-01-to-2026-01-31-cee6b8fa.csv",
    rating: "Perfomance Reports/0126 Jan/ratings-export-2026-01-01-to-2026-01-31-cee6b8fa.csv"
  },
  "2026-02": {
    message: "Perfomance Reports/0226 Feb/messageLog-export-2026-02-01-to-2026-02-28-51d35861.csv",
    rating: "Perfomance Reports/0226 Feb/ratings-export-2026-02-01-to-2026-02-28-1015e5c3.csv"
  },
  "2026-03": {
    message: "Perfomance Reports/0326 March/messageLog-export-2026-03-01-to-2026-03-31-21f86f20.csv"
  },
  "2026-04": {
    message: "Perfomance Reports/0426 Aprl/messageLog-export-2026-04-01-to-2026-04-30-ffc781c9.csv",
    rating: "Perfomance Reports/0426 Aprl/ratings-export-2026-04-01-to-2026-04-30-ffc781c9.csv"
  },
  "2026-05": {
    message: "Perfomance Reports/0526 May/messageLog-export-2026-05-01-to-2026-05-31-b89b4ffb.csv",
    rating: "Perfomance Reports/0526 May/ratings-export-2026-05-01-to-2026-05-31-b89b4ffb.csv"
  },
  "2026-06": {
    message: "Perfomance Reports/0626 Jun/messageLog-export-2026-06-01-to-2026-06-30-8f06b96c.csv",
    rating: "Perfomance Reports/0626 Jun/ratings-export-2026-06-01-to-2026-06-30-8f06b96c.csv"
  }
};

const csvMachineIdMap = {
  "135ef541-0de0-41cb-bd1f-c909b3ddb9a3":"NO1-M8-BKP-01",
  "53c8aecf-7c86-4034-9b84-ffa5b9bb11a1":"NO2-M7-BKE-01",
  "931f1948-b731-47a8-a4c2-bdd48d473584":"NO3-M6-NGW-01",
  "7cf9a0bf-c5f3-4128-aded-8f86f8879f5e":"NO3-M6-NGW-01",
  "c9f04fd5-e1d4-47a5-8866-ac555bced1d3":"NO4-M5-THA-01",
  "16f880a4-ccd9-41b6-a3ad-0f0075b649a2":"NO5-M3-EVT-01"
};

function parseCsv(path) {
  const raw = readFileSync(path, "utf8");
  const parsed = Papa.parse(raw, {
    header: true,
    skipEmptyLines: true
  });
  return parsed.data;
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(+date)) return null;
  return date;
}

function isoDate(date) {
  return date ? date.toISOString().slice(0, 10) : null;
}

function detectInput(question = "", audioUrl = "") {
  if (String(question).trim().toLowerCase().startsWith("quick reply:")) return "quickReply";
  if (String(audioUrl || "").trim()) return "voice";
  return "keyboard";
}

function detectLanguage(language = "") {
  const value = String(language || "").toLowerCase();
  if (value.startsWith("th")) return "thai";
  if (value.startsWith("en")) return "english";
  if (value.startsWith("zh")) return "chinese";
  return "others";
}

function createMetricBucket() {
  return {
    sessionIds: new Set(),
    questions: 0,
    voice: 0,
    quickReply: 0,
    keyboard: 0,
    thai: 0,
    english: 0,
    chinese: 0,
    others: 0,
    success: 0,
    apology: 0,
    ratings: []
  };
}

function buildPerformanceReportData(rootDir) {
  const csvMachineMetrics = {};
  const monthMeta = {};

  for (const [monthId, files] of Object.entries(reportFiles)) {
    const messageRows = parseCsv(join(rootDir, files.message));
    const metricsByAsset = {};
    let minDate = null;
    let maxDate = null;

    for (const row of messageRows) {
      const assetId = csvMachineIdMap[row.machineId];
      if (!assetId) continue;
      if (!metricsByAsset[assetId]) metricsByAsset[assetId] = createMetricBucket();
      const bucket = metricsByAsset[assetId];
      bucket.sessionIds.add(String(row.sessionId || ""));
      bucket.questions += 1;
      bucket[detectInput(row.question, row.audioUrl)] += 1;
      bucket[detectLanguage(row.language)] += 1;
      if (String(row.isApology || "").toLowerCase() === "true") bucket.apology += 1;
      else bucket.success += 1;

      const start = normalizeDate(row.startAt);
      if (start && (!minDate || start < minDate)) minDate = start;
      if (start && (!maxDate || start > maxDate)) maxDate = start;
    }

    if (files.rating) {
      const ratingRows = parseCsv(join(rootDir, files.rating));
      for (const row of ratingRows) {
        const assetId = csvMachineIdMap[row.machineId];
        if (!assetId) continue;
        if (!metricsByAsset[assetId]) metricsByAsset[assetId] = createMetricBucket();
        const rating = Number(row.rating || 0);
        if (rating > 0) metricsByAsset[assetId].ratings.push(rating);
      }
    }

    csvMachineMetrics[monthId] = Object.fromEntries(
      Object.entries(metricsByAsset).map(([assetId, bucket]) => {
        const rating = bucket.ratings.length
          ? Number((bucket.ratings.reduce((sum, value) => sum + value, 0) / bucket.ratings.length).toFixed(2))
          : undefined;
        const base = [
          bucket.sessionIds.size,
          bucket.questions,
          bucket.voice,
          bucket.quickReply,
          bucket.keyboard,
          bucket.thai,
          bucket.english,
          bucket.chinese,
          bucket.others,
          bucket.success,
          bucket.apology
        ];
        if (rating !== undefined) base.push(rating);
        return [assetId, base];
      })
    );

    monthMeta[monthId] = {
      coverageStart: isoDate(minDate),
      coverageEnd: isoDate(maxDate)
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    source: "Performance Reports CSV",
    historyStart: "1 Sep 2025",
    historyEnd: "30 Jun 2026",
    monthMeta,
    csvMachineMetrics
  };
}

export function writePerformanceReportData(rootDir = process.cwd()) {
  const payload = buildPerformanceReportData(rootDir);
  const outputPath = join(rootDir, "outputs", "assets", "performance-report-data.js");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(
    outputPath,
    `window.__PERFORMANCE_REPORT_DATA__ = ${JSON.stringify(payload, null, 2)};\n`,
    "utf8"
  );
  return outputPath;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = writePerformanceReportData(process.cwd());
  console.log(`Generated ${out}`);
}
