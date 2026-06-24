import { AlertCircle } from "lucide-react";
import { ErrorLog } from "../types/dashboard";

interface ErrorLogTableProps {
  rows: ErrorLog[];
}

const statusClass = {
  "To fix": "issue-open",
  Fixed: "issue-fixed",
  "Need confirmation": "issue-confirm"
};

export function ErrorLogTable({ rows }: ErrorLogTableProps) {
  return (
    <section className="panel table-panel">
      <div className="panel-header">
        <div>
          <h2>Incorrect answers and knowledge gaps</h2>
          <p>Wrong, missing, confusing, or outdated answers that need KM or owner action.</p>
        </div>
        <span className="panel-badge warning">
          <AlertCircle size={14} />
          {rows.filter((row) => row.status !== "Fixed").length} open
        </span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Kiosk</th>
              <th>User question</th>
              <th>AI answer</th>
              <th>Issue</th>
              <th>Correct answer</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.date}</td>
                <td>{row.kiosk}</td>
                <td>{row.userQuestion}</td>
                <td>{row.aiAnswer}</td>
                <td>{row.issueType}</td>
                <td>{row.correctAnswer}</td>
                <td><span className={`issue-pill ${statusClass[row.status]}`}>{row.status}</span></td>
                <td>{row.owner}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
