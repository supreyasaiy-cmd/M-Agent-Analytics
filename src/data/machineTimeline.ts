export interface MachineTimelineEntry {
  startDate: string;
  endDate: string;
  type: "Permanent" | "Event" | "Internal Relocation" | "Temporary Relocation" | "Standby";
  location: string;
  event: string;
  status: "Active" | "Borrowed" | "Available";
}

export interface MachineTimeline {
  assetId: string;
  machineName: string;
  screenSize: string;
  timeline: MachineTimelineEntry[];
}

export const machineTimelines: MachineTimeline[] = [
  {
    assetId: "NO1-M8-BKP-01",
    machineName: "TheMall-001",
    screenSize: "Not provided",
    timeline: [
      { startDate: "Initial", endDate: "2025-06-26", type: "Permanent", location: "M8 Bangkapi - Information Counter (G)", event: "Initial Deployment", status: "Active" },
      { startDate: "2025-06-27", endDate: "2025-06-28", type: "Event", location: "QSNCC", event: "Marketing Oops 2025", status: "Borrowed" },
      { startDate: "2025-07-04", endDate: "2025-07-13", type: "Event", location: "M8 Bangkapi", event: "อร่อยทั่วไทย M8", status: "Borrowed" },
      { startDate: "2025-07-09", endDate: "2025-07-10", type: "Event", location: "Centara Grand Ladprao", event: "PTT OPEX DAY 2025", status: "Borrowed" },
      { startDate: "2025-07-14", endDate: "2025-07-23", type: "Internal Relocation", location: "M8 Platinum Lounge", event: "Platinum Lounge", status: "Active" },
      { startDate: "2025-07-24", endDate: "2025-07-28", type: "Temporary Relocation", location: "M6 Ngamwongwan", event: "Gen ใหม่ Life สนุก", status: "Active" },
      { startDate: "2025-07-29", endDate: "2025-08-27", type: "Permanent", location: "M6 Information Counter", event: "Information Counter M6", status: "Active" },
      { startDate: "2025-08-28", endDate: "2025-08-31", type: "Event", location: "M7 Bangkae", event: "WORLD PUP EXPO 2025", status: "Borrowed" },
      { startDate: "2025-10-28", endDate: "2025-11-09", type: "Event", location: "M7 Bangkae", event: "Power Mall Gamer Festival", status: "Borrowed" },
      { startDate: "2026-04-10", endDate: "Present", type: "Permanent", location: "M8 Bangkapi - Information Counter (G)", event: "Machine Consolidation", status: "Active" }
    ]
  },
  {
    assetId: "NO2-M7-BKE-01",
    machineName: "TheMall-002",
    screenSize: "43 in",
    timeline: [
      { startDate: "Initial", endDate: "2026-04-09", type: "Permanent", location: "M7 Bangkae - Information Counter", event: "Initial Deployment", status: "Active" },
      { startDate: "2026-04-10", endDate: "Present", type: "Permanent", location: "M8 Bangkapi - E-Stamp (G)", event: "Machine Consolidation", status: "Active" },
      { startDate: "2026-05-15", endDate: "2026-05-16", type: "Event", location: "Bangkok Bank Event", event: "Bangkok Bank M VISA", status: "Borrowed" },
      { startDate: "2026-06-11", endDate: "2026-06-11", type: "Event", location: "QSNCC", event: "Marketing Oops 2026", status: "Borrowed" }
    ]
  },
  {
    assetId: "NO3-M6-NGW-01",
    machineName: "TheMall-003",
    screenSize: "Not provided",
    timeline: [
      { startDate: "Initial", endDate: "2026-04-09", type: "Permanent", location: "M6 Ngamwongwan - Information Counter", event: "Initial Deployment", status: "Active" },
      { startDate: "2026-04-10", endDate: "Present", type: "Permanent", location: "M8 Bangkapi - Bank Zone ชั้น 2", event: "Machine Consolidation", status: "Active" }
    ]
  },
  {
    assetId: "NO4-M5-THA-01",
    machineName: "TheMall-004",
    screenSize: "Not provided",
    timeline: [
      { startDate: "Initial", endDate: "2026-04-09", type: "Permanent", location: "M5 Thapra - Information Counter", event: "Initial Deployment", status: "Active" },
      { startDate: "2026-04-10", endDate: "Present", type: "Permanent", location: "M8 Bangkapi - Platinum Lounge ชั้น 2", event: "Machine Consolidation", status: "Active" },
      { startDate: "2026-06-05", endDate: "2026-06-10", type: "Event", location: "M7 Bangkae", event: "The Mall Lifestore Sports Fest", status: "Borrowed" }
    ]
  },
  {
    assetId: "NO5-M3-EVT-01",
    machineName: "TheMall-005",
    screenSize: "55 in",
    timeline: [
      { startDate: "Initial", endDate: "2025-11-09", type: "Standby", location: "M3 Ramkhamhaeng", event: "Standby", status: "Available" },
      { startDate: "2025-11-10", endDate: "2025-12-10", type: "Event", location: "Siam Paragon", event: "Electronica 2025", status: "Borrowed" },
      { startDate: "2025-12-03", endDate: "2025-12-04", type: "Event", location: "Samyan Mitrtown", event: "Sustainability Forum 2026", status: "Borrowed" },
      { startDate: "2026-04-10", endDate: "Present", type: "Permanent", location: "M8 Bangkapi - Dining Zone ชั้น 3", event: "Machine Consolidation", status: "Active" }
    ]
  }
];

export const globalMachineTimeline = [
  { date: "Initial Deployment", activity: "ติดตั้ง 5 เครื่องประจำ 4 สาขา + 1 เครื่อง Event" },
  { date: "27 Jun 2025", activity: "Marketing Oops" },
  { date: "Jul 2025", activity: "Multiple Roadshow / Internal Relocation" },
  { date: "Aug 2025", activity: "World Pup Expo" },
  { date: "Oct-Nov 2025", activity: "Power Mall Gamer Festival" },
  { date: "Nov-Dec 2025", activity: "Electronica 2025" },
  { date: "Dec 2025", activity: "Sustainability Forum" },
  { date: "Dec 2025-Jan 2026", activity: "The Great New Year Campaign (Avatar Update ทุกเครื่อง)" },
  { date: "10 Apr 2026", activity: "Consolidate เครื่องทั้งหมดมายัง M8 Bangkapi" },
  { date: "May 2026", activity: "Bangkok Bank M VISA" },
  { date: "Jun 2026", activity: "Sports Fest" },
  { date: "Jun 2026", activity: "Marketing Oops 2026" }
];
