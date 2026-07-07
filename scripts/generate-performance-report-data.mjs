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

const legacyEventFiles = {
  "2025-06": "Perfomance Reports/0625 June/06 M Agent_June.csv",
  "2025-07": "Perfomance Reports/0725 July/07 M Agent_July.csv",
  "2025-08": "Perfomance Reports/0825 Aug/08 M Agent_August.csv"
};

const csvMachineIdMap = {
  "135ef541-0de0-41cb-bd1f-c909b3ddb9a3":"NO1-M8-BKP-01",
  "53c8aecf-7c86-4034-9b84-ffa5b9bb11a1":"NO2-M7-BKE-01",
  "931f1948-b731-47a8-a4c2-bdd48d473584":"NO3-M6-NGW-01",
  "7cf9a0bf-c5f3-4128-aded-8f86f8879f5e":"NO3-M6-NGW-01",
  "c9f04fd5-e1d4-47a5-8866-ac555bced1d3":"NO4-M5-THA-01",
  "16f880a4-ccd9-41b6-a3ad-0f0075b649a2":"NO5-M3-EVT-01"
};

const bangkokTimeZone = "Asia/Bangkok";

const eventCatalog = [
  {
    event: "Marketing Oops 2025",
    asset: "NO1-M8-BKP-01",
    original: "M8 Bangkapi - Information Counter (G)",
    location: "QSNCC",
    setup: "2025-06-27",
    returnDate: "2025-06-28",
    machineIds: ["303564c4-1183-4c81-8ca9-7abbc8ade1c8"]
  },
  {
    event: "อร่อยทั่วไทย M8",
    asset: "NO1-M8-BKP-01",
    original: "M8 Bangkapi - Information Counter (G)",
    location: "M8 Bangkapi",
    setup: "2025-07-04",
    returnDate: "2025-07-13",
    machineIds: [
      "c1f15ed8-5ce1-4286-bff1-00a512eb367e",
      "5ec3f496-098f-4e99-9ae4-fa7edf6d4761",
      "75be87ef-05e7-4a29-86e1-52190d2b65f1",
      "092b4fcf-37e8-481c-8c8a-39c541308dd3",
      "f740d5d4-6267-431e-8170-004c24c874de",
      "15da39c5-e84a-4f30-89f8-ae550d0c4190"
    ]
  },
  {
    event: "PTT OPEX DAY 2025",
    asset: "NO1-M8-BKP-01",
    original: "M8 Bangkapi - Information Counter (G)",
    location: "Centara Grand Ladprao",
    setup: "2025-07-09",
    returnDate: "2025-07-10",
    machineIds: [
      "c1f15ed8-5ce1-4286-bff1-00a512eb367e",
      "5ec3f496-098f-4e99-9ae4-fa7edf6d4761"
    ]
  },
  {
    event: "WORLD PUP EXPO 2025",
    asset: "NO1-M8-BKP-01",
    original: "M8 Bangkapi - Information Counter (G)",
    location: "M7 Bangkae",
    setup: "2025-08-28",
    returnDate: "2025-08-31",
    machineIds: ["135ef541-0de0-41cb-bd1f-c909b3ddb9a3"]
  },
  {
    event: "Power Mall Gamer Festival",
    asset: "NO1-M8-BKP-01",
    original: "M8 Bangkapi - Information Counter (G)",
    location: "M7 Bangkae",
    setup: "2025-10-28",
    returnDate: "2025-11-09"
  },
  {
    event: "Electronica 2025",
    asset: "NO5-M3-EVT-01",
    original: "M8 Bangkapi - Dining Zone ชั้น 3",
    location: "Siam Paragon",
    setup: "2025-11-10",
    returnDate: "2025-12-10"
  },
  {
    event: "Sustainability Forum 2026",
    asset: "NO5-M3-EVT-01",
    original: "M8 Bangkapi - Dining Zone ชั้น 3",
    location: "Samyan Mitrtown",
    setup: "2025-12-03",
    returnDate: "2025-12-04"
  },
  {
    event: "Bangkok Bank M VISA",
    asset: "NO2-M7-BKE-01",
    original: "M8 Bangkapi - E-Stamp (G)",
    location: "Bangkok Bank Event",
    setup: "2026-05-15",
    returnDate: "2026-05-16"
  },
  {
    event: "The Mall Lifestore Sports Fest",
    asset: "NO4-M5-THA-01",
    original: "M8 Bangkapi - Platinum Lounge ชั้น 2",
    location: "M7 Bangkae",
    setup: "2026-06-05",
    returnDate: "2026-06-10"
  },
  {
    event: "Marketing Oops 2026",
    asset: "NO2-M7-BKE-01",
    original: "M8 Bangkapi - E-Stamp (G)",
    location: "QSNCC",
    setup: "2026-06-11",
    returnDate: "2026-06-11"
  }
];

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

function formatLocalIsoDate(value, timeZone = bangkokTimeZone) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(+date)) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const get = type => parts.find(part => part.type === type)?.value || "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function formatEventDateRange(start, end) {
  return start === end ? start : `${start} to ${end}`;
}

function formatEventPerformance({ sessions, questions, rating }) {
  if (rating === null) return `${sessions} sessions, ${questions} questions, rating not available`;
  return `${sessions} sessions, ${questions} questions, ${rating.toFixed(1)} rating`;
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

function createDailyBucket() {
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

const categoryRules = [
  { name: "Promotion", patterns: [/promo/i, /promotion/i, /โปร/i, /campaign/i, /coupon/i, /คูปอง/i, /discount/i, /ส่วนลด/i] },
  { name: "M Card", patterns: [/\bm card\b/i, /\bm point\b/i, /คะแนน/i, /member/i, /สมาชิก/i, /บัตร/i, /visa/i] },
  { name: "Directory", patterns: [/where/i, /อยู่ชั้น/i, /อยู่โซน/i, /อยู่ไหน/i, /ทางไป/i, /location/i, /directory/i, /map/i, /แผนที่/i] },
  { name: "Parking", patterns: [/parking/i, /park/i, /จอดรถ/i, /ลานจอด/i, /stamp/i, /e-?stamp/i] },
  { name: "Events", patterns: [/event/i, /งาน/i, /booth/i, /roadshow/i, /festival/i, /expo/i, /forum/i] },
  { name: "Store Information", patterns: [/open/i, /close/i, /hour/i, /เวลา/i, /store/i, /branch/i, /สาขา/i, /เปิด/i, /ปิด/i] },
  { name: "Rewards", patterns: [/redeem/i, /reward/i, /แลก/i, /สิทธิ์/i, /privilege/i] },
  { name: "Restaurant", patterns: [/restaurant/i, /food/i, /eat/i, /coffee/i, /tea/i, /drink/i, /อาหาร/i, /ร้านอาหาร/i, /กาแฟ/i, /ชา/i] },
  { name: "Fashion", patterns: [/uniqlo/i, /fashion/i, /clothes/i, /เสื้อ/i, /เสื้อผ้า/i] },
  { name: "Beauty", patterns: [/beauty/i, /cosmetic/i, /skincare/i, /makeup/i, /เครื่องสำอาง/i] },
  { name: "Sports", patterns: [/sport/i, /nike/i, /adidas/i, /รองเท้า/i] },
  { name: "Lifestyle", patterns: [/lifestyle/i, /home/i, /living/i, /ของใช้/i] }
];

const brandRules = [
  "Uniqlo",
  "Starbucks",
  "McDonald's",
  "Nike",
  "Adidas",
  "Power Mall",
  "Gourmet Market",
  "Apple",
  "Bangkok Bank",
  "M Card"
].map(name => ({
  name,
  patterns: [new RegExp(name.replace(/\s+/g, "\\s*"), "i")]
}));

function detectCategory(question = "") {
  const text = String(question || "");
  const match = categoryRules.find(rule => rule.patterns.some(pattern => pattern.test(text)));
  return match?.name || "Others";
}

function detectBrands(question = "") {
  const text = String(question || "");
  return brandRules.filter(rule => rule.patterns.some(pattern => pattern.test(text))).map(rule => rule.name);
}

function incrementCounter(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function buildPerformanceReportData(rootDir) {
  const csvMachineMetrics = {};
  const monthMeta = {};
  const allMessageRows = [];
  const allRatingRows = [];
  const dailyAssetMetrics = {};
  const monthQuestionCounts = {};
  const monthQuestionCategoryCounts = {};
  const monthBrandCounts = {};
  const monthAssetCategoryCounts = {};
  const monthAssetBrandCounts = {};

  for (const [monthId, files] of Object.entries(reportFiles)) {
    const messageRows = parseCsv(join(rootDir, files.message));
    const metricsByAsset = {};
    let minDate = null;
    let maxDate = null;

    for (const row of messageRows) {
      const assetId = csvMachineIdMap[row.machineId];
      if (!assetId) continue;
      const questionText = String(row.question || "").trim();
      const category = detectCategory(questionText);
      const brands = detectBrands(questionText);
      if (!metricsByAsset[assetId]) metricsByAsset[assetId] = createMetricBucket();
      const bucket = metricsByAsset[assetId];
      bucket.sessionIds.add(String(row.sessionId || ""));
      bucket.questions += 1;
      bucket[detectInput(row.question, row.audioUrl)] += 1;
      bucket[detectLanguage(row.language)] += 1;
      if (String(row.isApology || "").toLowerCase() === "true") bucket.apology += 1;
      else bucket.success += 1;

      if (!monthQuestionCounts[monthId]) monthQuestionCounts[monthId] = new Map();
      if (!monthQuestionCategoryCounts[monthId]) monthQuestionCategoryCounts[monthId] = new Map();
      if (!monthBrandCounts[monthId]) monthBrandCounts[monthId] = new Map();
      if (!monthAssetCategoryCounts[monthId]) monthAssetCategoryCounts[monthId] = {};
      if (!monthAssetBrandCounts[monthId]) monthAssetBrandCounts[monthId] = {};
      if (!monthAssetCategoryCounts[monthId][assetId]) monthAssetCategoryCounts[monthId][assetId] = new Map();
      if (!monthAssetBrandCounts[monthId][assetId]) monthAssetBrandCounts[monthId][assetId] = new Map();

      if (questionText) incrementCounter(monthQuestionCounts[monthId], `${questionText}|||${category}`);
      incrementCounter(monthQuestionCategoryCounts[monthId], category);
      incrementCounter(monthAssetCategoryCounts[monthId][assetId], category);
      brands.forEach(brand => {
        incrementCounter(monthBrandCounts[monthId], brand);
        incrementCounter(monthAssetBrandCounts[monthId][assetId], brand);
      });

      const start = normalizeDate(row.startAt);
      const localDate = formatLocalIsoDate(start);
      if (localDate) {
        if (!dailyAssetMetrics[localDate]) dailyAssetMetrics[localDate] = {};
        if (!dailyAssetMetrics[localDate][assetId]) dailyAssetMetrics[localDate][assetId] = createDailyBucket();
        const dailyBucket = dailyAssetMetrics[localDate][assetId];
        dailyBucket.sessionIds.add(String(row.sessionId || ""));
        dailyBucket.questions += 1;
        dailyBucket[detectInput(row.question, row.audioUrl)] += 1;
        dailyBucket[detectLanguage(row.language)] += 1;
        if (String(row.isApology || "").toLowerCase() === "true") dailyBucket.apology += 1;
        else dailyBucket.success += 1;
      }
      allMessageRows.push({
        assetId,
        machineId: String(row.machineId || ""),
        sessionId: String(row.sessionId || ""),
        localDate,
        monthId: localDate?.slice(0, 7) || monthId
      });
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
        const localDate = formatLocalIsoDate(row.startAt);
        if (localDate && rating > 0) {
          if (!dailyAssetMetrics[localDate]) dailyAssetMetrics[localDate] = {};
          if (!dailyAssetMetrics[localDate][assetId]) dailyAssetMetrics[localDate][assetId] = createDailyBucket();
          dailyAssetMetrics[localDate][assetId].ratings.push(rating);
        }
        allRatingRows.push({
          assetId,
          machineId: String(row.machineId || ""),
          rating,
          localDate,
          monthId
        });
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

  const topQuestionsByMonth = Object.fromEntries(
    Object.entries(monthQuestionCounts).map(([monthId, counts]) => [
      monthId,
      [...counts.entries()]
        .map(([key, count]) => {
          const [question, category] = key.split("|||");
          return [question, category, count];
        })
        .sort((a, b) => b[2] - a[2])
        .slice(0, 12)
    ])
  );

  const topicSummaryByMonth = Object.fromEntries(
    Object.entries(monthQuestionCategoryCounts).map(([monthId, counts]) => {
      const total = [...counts.values()].reduce((sum, value) => sum + value, 0) || 1;
      return [
        monthId,
        [...counts.entries()]
          .map(([name, value]) => [name, value, Math.round((value / total) * 100)])
          .sort((a, b) => b[1] - a[1])
      ];
    })
  );

  const brandSummaryByMonth = Object.fromEntries(
    Object.entries(monthBrandCounts).map(([monthId, counts]) => [
      monthId,
      [...counts.entries()]
        .map(([name, value]) => [name, value])
        .sort((a, b) => b[1] - a[1])
    ])
  );

  const categoryByAssetByMonth = Object.fromEntries(
    Object.entries(monthAssetCategoryCounts).map(([monthId, assets]) => [
      monthId,
      Object.fromEntries(
        Object.entries(assets).map(([assetId, counts]) => [
          assetId,
          [...counts.entries()]
            .map(([name, value]) => [name, value])
            .sort((a, b) => b[1] - a[1])
        ])
      )
    ])
  );

  const brandByAssetByMonth = Object.fromEntries(
    Object.entries(monthAssetBrandCounts).map(([monthId, assets]) => [
      monthId,
      Object.fromEntries(
        Object.entries(assets).map(([assetId, counts]) => [
          assetId,
          [...counts.entries()]
            .map(([name, value]) => [name, value])
            .sort((a, b) => b[1] - a[1])
        ])
      )
    ])
  );

  const serializedDailyMetrics = Object.fromEntries(
    Object.entries(dailyAssetMetrics).map(([date, assets]) => [
      date,
      Object.fromEntries(
        Object.entries(assets).map(([assetId, bucket]) => {
          const rating = bucket.ratings.length
            ? Number((bucket.ratings.reduce((sum, value) => sum + value, 0) / bucket.ratings.length).toFixed(2))
            : undefined;
          const row = [
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
          if (rating !== undefined) row.push(rating);
          return [assetId, row];
        })
      )
    ])
  );

  for (const [monthId, file] of Object.entries(legacyEventFiles)) {
    const messageRows = parseCsv(join(rootDir, file));
    for (const row of messageRows) {
      const start = normalizeDate(row.startAt);
      const localDate = formatLocalIsoDate(start);
      allMessageRows.push({
        assetId: csvMachineIdMap[row.machineId] || null,
        machineId: String(row.machineId || ""),
        sessionId: String(row.sessionId || ""),
        localDate,
        monthId: localDate?.slice(0, 7) || monthId
      });
    }
  }

  const eventHistory = eventCatalog.map((event, index) => {
    const startDate = event.setup;
    const endDate = event.returnDate || event.setup;
    const machineIdSet = event.machineIds ? new Set(event.machineIds) : null;
    const messageRows = allMessageRows.filter(row =>
      (machineIdSet ? machineIdSet.has(row.machineId) : row.assetId === event.asset) &&
      row.localDate &&
      row.localDate >= startDate &&
      row.localDate <= endDate
    );
    const ratingRows = allRatingRows.filter(row =>
      (machineIdSet ? machineIdSet.has(row.machineId) : row.assetId === event.asset) &&
      row.localDate &&
      row.localDate >= startDate &&
      row.localDate <= endDate &&
      Number.isFinite(row.rating)
    );
    const sessionIds = new Set(messageRows.map(row => row.sessionId).filter(Boolean));
    const sessions = sessionIds.size;
    const questions = messageRows.length;
    const rating = ratingRows.length
      ? Number((ratingRows.reduce((sum, row) => sum + row.rating, 0) / ratingRows.length).toFixed(1))
      : null;

    return {
      id: index,
      month: startDate.slice(0, 7),
      event: event.event,
      date: formatEventDateRange(startDate, endDate),
      asset: event.asset,
      original: event.original,
      location: event.location,
      setup: startDate,
      returnDate: endDate,
      performance: formatEventPerformance({ sessions, questions, rating }),
      notes: `Performance calculated automatically from the Performance Reports CSV for ${startDate}${startDate === endDate ? "" : ` to ${endDate}`}.`
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    source: "Performance Reports CSV",
    historyStart: "1 Sep 2025",
    historyEnd: "30 Jun 2026",
    monthMeta,
    csvMachineMetrics,
    dailyAssetMetrics: serializedDailyMetrics,
    topQuestionsByMonth,
    topicSummaryByMonth,
    brandSummaryByMonth,
    categoryByAssetByMonth,
    brandByAssetByMonth,
    eventHistory
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
