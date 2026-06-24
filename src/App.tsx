import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { DataImportPanel } from "./components/DataImportPanel";
import { ErrorLogTable } from "./components/ErrorLogTable";
import { EventBorrowingLog } from "./components/EventBorrowingLog";
import { KioskPerformanceTable } from "./components/KioskPerformanceTable";
import { LocationTimeline } from "./components/LocationTimeline";
import { MonthlyInsights } from "./components/MonthlyInsights";
import { MonthlyOverview } from "./components/MonthlyOverview";
import { TopTopicsChart } from "./components/TopTopicsChart";
import {
  errorLogs,
  eventBorrowing,
  kioskPerformance,
  kiosks,
  locationHistory,
  months,
  repeatedQuestions,
  topicMetrics
} from "./data/mockData";
import { KioskStatus } from "./types/dashboard";
import {
  buildComparedMetrics,
  getMonthlyRows,
  getOverviewMetrics,
  getPreviousMonthId
} from "./utils/metrics";

const statusOptions: Array<KioskStatus | "All"> = ["All", "Active", "Moved", "Event", "Maintenance", "Standby"];

export default function App() {
  const [selectedMonthId, setSelectedMonthId] = useState(months[0].id);
  const [selectedStatus, setSelectedStatus] = useState<KioskStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState(kiosks[0].assetId);

  const selectedMonth = months.find((month) => month.id === selectedMonthId) ?? months[0];
  const previousMonthId = getPreviousMonthId(months, selectedMonthId);
  const previousMonth = months.find((month) => month.id === previousMonthId) ?? selectedMonth;

  const rowsForMonth = useMemo(() => getMonthlyRows(kioskPerformance, selectedMonthId), [selectedMonthId]);
  const previousRows = useMemo(() => getMonthlyRows(kioskPerformance, previousMonthId), [previousMonthId]);

  const filteredKiosks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return kiosks.filter((kiosk) => {
      const statusMatch = selectedStatus === "All" || kiosk.status === selectedStatus;
      const queryMatch =
        !query ||
        kiosk.assetId.toLowerCase().includes(query) ||
        kiosk.branch.toLowerCase().includes(query) ||
        kiosk.currentLocation.toLowerCase().includes(query);
      return statusMatch && queryMatch;
    });
  }, [searchQuery, selectedStatus]);

  const filteredAssetIds = new Set(filteredKiosks.map((kiosk) => kiosk.assetId));
  const filteredPerformance = rowsForMonth.filter((row) => filteredAssetIds.has(row.assetId));
  const selectedKiosk = kiosks.find((kiosk) => kiosk.assetId === selectedAssetId);
  const selectedHistory = locationHistory.filter((history) => history.assetId === selectedAssetId);
  const topicsForMonth = topicMetrics.filter((topic) => topic.monthId === selectedMonthId);
  const repeatedForMonth = repeatedQuestions.filter((question) => question.monthId === selectedMonthId);
  const errorsForMonth = errorLogs.filter((error) => error.monthId === selectedMonthId);
  const eventsForMonth = eventBorrowing.filter((event) => event.monthId === selectedMonthId);

  const overviewMetrics = buildComparedMetrics(
    getOverviewMetrics(filteredPerformance, selectedMonth),
    getOverviewMetrics(previousRows, previousMonth)
  );

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">Internal performance command center</span>
          <h1>M-Agent AI Kiosk Monthly Performance</h1>
          <p>
            Monitor branch and event kiosk movement, engagement, user question patterns, answer quality,
            and the KM gaps that need improvement.
          </p>
        </div>
        <div className="hero-actions">
          <label>
            Month
            <select value={selectedMonthId} onChange={(event) => setSelectedMonthId(event.target.value)}>
              {months.map((month) => (
                <option key={month.id} value={month.id}>{month.label}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as KioskStatus | "All")}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="filter-strip">
        <div className="search-box">
          <Search size={17} />
          <input
            aria-label="Search kiosks"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search asset, branch, location"
            value={searchQuery}
          />
        </div>
        <div className="filter-note">
          <SlidersHorizontal size={16} />
          <span>{filteredPerformance.length} kiosks included · Comparing with {previousMonth.label}</span>
        </div>
      </section>

      <MonthlyOverview metrics={overviewMetrics} comparisonLabel={previousMonth.label} />

      <div className="dashboard-grid">
        <MonthlyInsights
          errors={errorsForMonth}
          events={eventsForMonth}
          kiosks={filteredKiosks}
          performance={filteredPerformance}
          topics={topicsForMonth}
        />
        <DataImportPanel />
      </div>

      <KioskPerformanceTable
        daysInMonth={selectedMonth.daysInMonth}
        kiosks={filteredKiosks}
        onSelectAsset={setSelectedAssetId}
        rows={filteredPerformance}
        selectedAssetId={selectedAssetId}
      />

      <div className="dashboard-grid dashboard-grid--timeline">
        <LocationTimeline history={selectedHistory} selectedKiosk={selectedKiosk} />
        <TopTopicsChart questions={repeatedForMonth} topics={topicsForMonth} />
      </div>

      <ErrorLogTable rows={errorsForMonth} />
      <EventBorrowingLog rows={eventsForMonth} />
    </main>
  );
}
