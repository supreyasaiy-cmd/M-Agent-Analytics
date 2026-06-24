import {
  ErrorLog,
  EventBorrowing,
  Kiosk,
  KioskPerformance,
  LocationHistory,
  MonthOption,
  RepeatedQuestion,
  TopicMetric
} from "../types/dashboard";

export const months: MonthOption[] = [
  { id: "2026-06", label: "June 2026", year: 2026, month: 6, daysInMonth: 30 },
  { id: "2026-05", label: "May 2026", year: 2026, month: 5, daysInMonth: 31 },
  { id: "2026-04", label: "April 2026", year: 2026, month: 4, daysInMonth: 30 },
  { id: "2026-03", label: "March 2026", year: 2026, month: 3, daysInMonth: 31 },
  { id: "2026-02", label: "February 2026", year: 2026, month: 2, daysInMonth: 28 },
  { id: "2026-01", label: "January 2026", year: 2026, month: 1, daysInMonth: 31 },
  { id: "2025-12", label: "December 2025", year: 2025, month: 12, daysInMonth: 31 },
  { id: "2025-11", label: "November 2025", year: 2025, month: 11, daysInMonth: 30 },
  { id: "2025-10", label: "October 2025", year: 2025, month: 10, daysInMonth: 31 },
  { id: "2025-09", label: "September 2025", year: 2025, month: 9, daysInMonth: 30 }
];

export const kiosks: Kiosk[] = [
  {
    assetId: "TheMall-001-M5-BKP-01",
    screenSize: "55 in",
    branch: "The Mall Bangkapi",
    currentLocation: "E-Stamp G Floor",
    locationPeriod: "16-30 Jun",
    status: "Moved",
    notes: "Moved after Marketing Oops event, strong promotion queries."
  },
  {
    assetId: "TheMall-002-M7-BKE-01",
    screenSize: "65 in",
    branch: "The Mall Bangkae",
    currentLocation: "G Floor Information",
    locationPeriod: "1-30 Jun",
    status: "Active",
    notes: "Stable placement near information counter."
  },
  {
    assetId: "TheMall-003-M6-NGW-01",
    screenSize: "55 in",
    branch: "The Mall Ngamwongwan",
    currentLocation: "Food Hall Entrance",
    locationPeriod: "1-30 Jun",
    status: "Active",
    notes: "High store-location and parking intent."
  },
  {
    assetId: "TheMall-004-M5-THA-01",
    screenSize: "55 in",
    branch: "The Mall Thapra",
    currentLocation: "Maintenance room",
    locationPeriod: "18-30 Jun",
    status: "Maintenance",
    notes: "Audio input issue reported on 18 Jun."
  },
  {
    assetId: "TheMall-005-M7-EVT-01",
    screenSize: "65 in",
    branch: "Event Pool",
    currentLocation: "Marketing Oops 2026 Event",
    locationPeriod: "11-15 Jun",
    status: "Event",
    notes: "Borrowed for booth traffic and QR promotion flow."
  }
];

export const locationHistory: LocationHistory[] = [
  {
    assetId: "TheMall-001-M5-BKP-01",
    from: "2026-06-01",
    to: "2026-06-10",
    branchOrEvent: "The Mall Bangkapi",
    location: "G Floor Information",
    type: "Branch",
    note: "Baseline branch placement."
  },
  {
    assetId: "TheMall-001-M5-BKP-01",
    from: "2026-06-11",
    to: "2026-06-15",
    branchOrEvent: "Marketing Oops 2026 Event",
    location: "Queen Sirikit National Convention Center",
    type: "Event",
    note: "Borrowed for campaign booth."
  },
  {
    assetId: "TheMall-001-M5-BKP-01",
    from: "2026-06-16",
    to: "2026-06-30",
    branchOrEvent: "The Mall Bangkapi",
    location: "E-Stamp G Floor",
    type: "Branch",
    note: "Relocated to promotion traffic zone."
  },
  {
    assetId: "TheMall-004-M5-THA-01",
    from: "2026-06-01",
    to: "2026-06-17",
    branchOrEvent: "The Mall Thapra",
    location: "G Floor Lift Hall",
    type: "Branch",
    note: "Normal operations before maintenance."
  },
  {
    assetId: "TheMall-004-M5-THA-01",
    from: "2026-06-18",
    to: "2026-06-30",
    branchOrEvent: "The Mall Thapra",
    location: "Maintenance room",
    type: "Maintenance",
    note: "Voice capture issue under review."
  }
];

const basePerformance: Omit<KioskPerformance, "monthId">[] = [
  {
    assetId: "TheMall-001-M5-BKP-01",
    sessions: 1180,
    questions: 2876,
    voice: 1620,
    quickReply: 850,
    keyboard: 406,
    thai: 2430,
    english: 325,
    chinese: 82,
    others: 39,
    rating: 4.4,
    successAnswers: 2634,
    apologyAnswers: 242
  },
  {
    assetId: "TheMall-002-M7-BKE-01",
    sessions: 940,
    questions: 2018,
    voice: 1118,
    quickReply: 610,
    keyboard: 290,
    thai: 1742,
    english: 196,
    chinese: 54,
    others: 26,
    rating: 4.2,
    successAnswers: 1846,
    apologyAnswers: 172
  },
  {
    assetId: "TheMall-003-M6-NGW-01",
    sessions: 815,
    questions: 1796,
    voice: 980,
    quickReply: 522,
    keyboard: 294,
    thai: 1548,
    english: 171,
    chinese: 48,
    others: 29,
    rating: 4.1,
    successAnswers: 1612,
    apologyAnswers: 184
  },
  {
    assetId: "TheMall-004-M5-THA-01",
    sessions: 404,
    questions: 782,
    voice: 384,
    quickReply: 260,
    keyboard: 138,
    thai: 692,
    english: 62,
    chinese: 16,
    others: 12,
    rating: 3.7,
    successAnswers: 657,
    apologyAnswers: 125
  },
  {
    assetId: "TheMall-005-M7-EVT-01",
    sessions: 620,
    questions: 1345,
    voice: 742,
    quickReply: 433,
    keyboard: 170,
    thai: 1064,
    english: 221,
    chinese: 42,
    others: 18,
    rating: 4.5,
    successAnswers: 1246,
    apologyAnswers: 99
  }
];

const monthlyMultipliers: Record<string, number[]> = {
  "2026-06": [1, 1, 1, 1, 1],
  "2026-05": [0.82, 0.9, 0.86, 1.18, 0.42],
  "2026-04": [0.76, 0.84, 0.78, 1.05, 0.28],
  "2026-03": [0.7, 0.78, 0.72, 0.92, 0.2],
  "2026-02": [0.62, 0.7, 0.66, 0.84, 0.18],
  "2026-01": [0.56, 0.64, 0.58, 0.72, 0.16],
  "2025-12": [0.48, 0.52, 0.46, 0.54, 0.88],
  "2025-11": [0.42, 0.46, 0.38, 0.42, 0.95],
  "2025-10": [0.34, 0.38, 0.3, 0.36, 0.3],
  "2025-09": [0.22, 0.25, 0.2, 0.24, 0.18]
};

export const kioskPerformance: KioskPerformance[] = months.flatMap((month, monthIndex) =>
  basePerformance.map((item, kioskIndex) => {
    const factor = monthlyMultipliers[month.id]?.[kioskIndex] ?? 1;
    const qualityDrift = Math.max(0, monthIndex * 0.06);
    return {
      ...item,
      monthId: month.id,
      sessions: Math.round(item.sessions * factor),
      questions: Math.round(item.questions * factor),
      successAnswers: Math.round(item.successAnswers * factor * Math.max(0.82, 1 - qualityDrift * 0.28)),
      apologyAnswers: Math.max(1, Math.round(item.apologyAnswers * factor * (1 + qualityDrift * 0.45))),
      rating: Number(Math.max(3.2, item.rating - qualityDrift).toFixed(1))
    };
  })
);

export const topicMetrics: TopicMetric[] = [
  { monthId: "2026-06", category: "Promotion", questions: 1840, share: 21 },
  { monthId: "2026-06", category: "M Card", questions: 1425, share: 17 },
  { monthId: "2026-06", category: "Directory", questions: 1320, share: 15 },
  { monthId: "2026-06", category: "Event", questions: 1184, share: 14 },
  { monthId: "2026-06", category: "Parking", questions: 940, share: 11 },
  { monthId: "2026-06", category: "Rewards", questions: 810, share: 9 },
  { monthId: "2026-06", category: "Store location", questions: 650, share: 8 },
  { monthId: "2026-06", category: "Others", questions: 431, share: 5 },
  { monthId: "2026-05", category: "Promotion", questions: 1280, share: 18 },
  { monthId: "2026-05", category: "M Card", questions: 1210, share: 17 },
  { monthId: "2026-05", category: "Directory", questions: 1188, share: 17 },
  { monthId: "2026-05", category: "Parking", questions: 880, share: 12 },
  { monthId: "2026-05", category: "Rewards", questions: 740, share: 10 }
];

export const repeatedQuestions: RepeatedQuestion[] = [
  { monthId: "2026-06", question: "วันนี้มีโปรโมชันอะไรบ้าง", category: "Promotion", count: 286 },
  { monthId: "2026-06", question: "สมัคร M Card ได้ที่ไหน", category: "M Card", count: 221 },
  { monthId: "2026-06", question: "ร้าน Uniqlo อยู่ชั้นไหน", category: "Directory", count: 198 },
  { monthId: "2026-06", question: "จอดรถฟรีกี่ชั่วโมง", category: "Parking", count: 166 },
  { monthId: "2026-06", question: "งาน Marketing Oops อยู่ตรงไหน", category: "Event", count: 142 },
  { monthId: "2026-06", question: "แลกคะแนน M Point ได้อย่างไร", category: "Rewards", count: 120 },
  { monthId: "2026-05", question: "วันนี้มีโปรโมชันอะไรบ้าง", category: "Promotion", count: 218 },
  { monthId: "2026-05", question: "ร้านอาหารอยู่ชั้นไหน", category: "Directory", count: 173 },
  { monthId: "2026-05", question: "สมัคร M Card ได้ที่ไหน", category: "M Card", count: 168 }
];

export const errorLogs: ErrorLog[] = [
  {
    id: "ERR-001",
    monthId: "2026-06",
    date: "2026-06-04",
    kiosk: "TheMall-003-M6-NGW-01",
    userQuestion: "ร้าน Apple เปิดถึงกี่โมง",
    aiAnswer: "เปิดถึง 21:00 น.",
    issueType: "Outdated content",
    correctAnswer: "เปิดถึง 22:00 น. ในวันศุกร์-อาทิตย์",
    status: "To fix",
    owner: "KM Team",
    note: "Update store hours source."
  },
  {
    id: "ERR-002",
    monthId: "2026-06",
    date: "2026-06-11",
    kiosk: "TheMall-001-M5-BKP-01",
    userQuestion: "บูธ Marketing Oops อยู่ฮอลล์ไหน",
    aiAnswer: "อยู่บริเวณ G Floor Information",
    issueType: "Wrong info",
    correctAnswer: "Queen Sirikit National Convention Center, Hall 3, Booth M12",
    status: "Fixed",
    owner: "Event Ops",
    note: "Event location pushed on 12 Jun."
  },
  {
    id: "ERR-003",
    monthId: "2026-06",
    date: "2026-06-16",
    kiosk: "TheMall-004-M5-THA-01",
    userQuestion: "จอดรถมอเตอร์ไซค์ตรงไหน",
    aiAnswer: "ขออภัยค่ะ ฉันยังไม่มีข้อมูลนี้",
    issueType: "Missing info",
    correctAnswer: "จอดได้ที่อาคารจอดรถ B ชั้น 1",
    status: "Need confirmation",
    owner: "Branch Ops",
    note: "Need branch confirmation before publishing."
  },
  {
    id: "ERR-004",
    monthId: "2026-05",
    date: "2026-05-21",
    kiosk: "TheMall-002-M7-BKE-01",
    userQuestion: "แลกคูปองร้านอาหารยังไง",
    aiAnswer: "กดรับสิทธิ์ในแอปแล้วใช้ได้ทันที",
    issueType: "Confusing answer",
    correctAnswer: "กดรับสิทธิ์ใน M Card app แล้วแสดง QR ให้ร้านสแกนก่อนชำระเงิน",
    status: "Fixed",
    owner: "CRM",
    note: "Response template improved."
  }
];

export const eventBorrowing: EventBorrowing[] = [
  {
    id: "EVT-001",
    monthId: "2026-06",
    eventName: "Marketing Oops 2026",
    eventDate: "2026-06-11 to 2026-06-15",
    assetId: "TheMall-001-M5-BKP-01",
    originalLocation: "The Mall Bangkapi, G Floor Information",
    eventLocation: "QSNCC Hall 3, Booth M12",
    setupDate: "2026-06-10",
    returnDate: "2026-06-16",
    performanceDuringEvent: "620 sessions, 1,345 questions, 4.5 rating",
    notes: "High event and QR promotion engagement."
  },
  {
    id: "EVT-002",
    monthId: "2026-05",
    eventName: "M Card Rewards Weekend",
    eventDate: "2026-05-24 to 2026-05-26",
    assetId: "TheMall-005-M7-EVT-01",
    originalLocation: "Event pool standby",
    eventLocation: "The Mall Bangkae Atrium",
    setupDate: "2026-05-23",
    returnDate: "2026-05-27",
    performanceDuringEvent: "274 sessions, 598 questions, 4.4 rating",
    notes: "Rewards questions spiked during redemption campaign."
  }
];
