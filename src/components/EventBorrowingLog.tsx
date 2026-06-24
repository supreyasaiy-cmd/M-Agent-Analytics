import { Truck } from "lucide-react";
import { EventBorrowing } from "../types/dashboard";

interface EventBorrowingLogProps {
  rows: EventBorrowing[];
}

export function EventBorrowingLog({ rows }: EventBorrowingLogProps) {
  return (
    <section className="panel table-panel">
      <div className="panel-header">
        <div>
          <h2>Event borrowing log</h2>
          <p>Track kiosk movement from branch to events and resulting engagement.</p>
        </div>
        <span className="panel-badge">
          <Truck size={14} />
          {rows.length} events
        </span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Event date</th>
              <th>Borrowed kiosk</th>
              <th>Original location</th>
              <th>Event location</th>
              <th>Setup</th>
              <th>Return</th>
              <th>Performance</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td><strong>{row.eventName}</strong></td>
                <td>{row.eventDate}</td>
                <td>{row.assetId}</td>
                <td>{row.originalLocation}</td>
                <td>{row.eventLocation}</td>
                <td>{row.setupDate}</td>
                <td>{row.returnDate}</td>
                <td>{row.performanceDuringEvent}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
