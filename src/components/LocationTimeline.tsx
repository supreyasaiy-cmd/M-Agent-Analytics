import { CalendarRange } from "lucide-react";
import { Kiosk, LocationHistory } from "../types/dashboard";

interface LocationTimelineProps {
  selectedKiosk?: Kiosk;
  history: LocationHistory[];
}

const typeClass = {
  Branch: "timeline-branch",
  Event: "timeline-event",
  Maintenance: "timeline-maintenance"
};

function formatDayRange(from: string, to: string) {
  const fromDate = new Date(`${from}T00:00:00`);
  const toDate = new Date(`${to}T00:00:00`);
  return `${fromDate.getDate()}-${toDate.getDate()} ${toDate.toLocaleString("en-US", { month: "short" })}`;
}

export function LocationTimeline({ selectedKiosk, history }: LocationTimelineProps) {
  return (
    <section className="panel timeline-panel">
      <div className="panel-header">
        <div>
          <h2>Location timeline</h2>
          <p>{selectedKiosk ? selectedKiosk.assetId : "Select a kiosk to inspect movement history."}</p>
        </div>
        <CalendarRange size={20} />
      </div>
      <div className="timeline">
        {history.length ? (
          history.map((item) => (
            <article className={`timeline-item ${typeClass[item.type]}`} key={`${item.assetId}-${item.from}`}>
              <div className="timeline-date">{formatDayRange(item.from, item.to)}</div>
              <div className="timeline-body">
                <strong>{item.branchOrEvent}</strong>
                <span>{item.location}</span>
                <p>{item.note}</p>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">No location movement recorded for this kiosk in the selected month.</div>
        )}
      </div>
    </section>
  );
}
