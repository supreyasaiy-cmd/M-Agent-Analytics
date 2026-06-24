export type KioskStatus = "Active" | "Moved" | "Event" | "Maintenance" | "Standby";
export type IssueStatus = "To fix" | "Fixed" | "Need confirmation";
export type IssueType = "Wrong info" | "Missing info" | "Confusing answer" | "Outdated content";

export interface MonthOption {
  id: string;
  label: string;
  year: number;
  month: number;
  daysInMonth: number;
}

export interface Kiosk {
  assetId: string;
  screenSize: string;
  branch: string;
  currentLocation: string;
  locationPeriod: string;
  status: KioskStatus;
  notes: string;
}

export interface LocationHistory {
  assetId: string;
  from: string;
  to: string;
  branchOrEvent: string;
  location: string;
  type: "Branch" | "Event" | "Maintenance";
  note: string;
}

export interface KioskPerformance {
  monthId: string;
  assetId: string;
  sessions: number;
  questions: number;
  voice: number;
  quickReply: number;
  keyboard: number;
  thai: number;
  english: number;
  chinese: number;
  others: number;
  rating: number;
  successAnswers: number;
  apologyAnswers: number;
}

export interface TopicMetric {
  monthId: string;
  category: string;
  questions: number;
  share: number;
}

export interface RepeatedQuestion {
  monthId: string;
  question: string;
  category: string;
  count: number;
}

export interface ErrorLog {
  id: string;
  monthId: string;
  date: string;
  kiosk: string;
  userQuestion: string;
  aiAnswer: string;
  issueType: IssueType;
  correctAnswer: string;
  status: IssueStatus;
  owner: string;
  note: string;
}

export interface EventBorrowing {
  id: string;
  monthId: string;
  eventName: string;
  eventDate: string;
  assetId: string;
  originalLocation: string;
  eventLocation: string;
  setupDate: string;
  returnDate: string;
  performanceDuringEvent: string;
  notes: string;
}

export interface ImportedDataset {
  fileName: string;
  rowCount: number;
  columns: string[];
  preview: Record<string, unknown>[];
}
