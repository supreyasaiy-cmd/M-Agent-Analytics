import { ArrowUpRight, Circle, MapPin } from "lucide-react";
import { Kiosk, KioskPerformance } from "../types/dashboard";
import { formatNumber, formatPercent, formatRating } from "../utils/metrics";

interface KioskPerformanceTableProps {
  kiosks: Kiosk[];
  rows: KioskPerformance[];
  daysInMonth: number;
  selectedAssetId: string;
  onSelectAsset: (assetId: string) => void;
}

const statusClass = {
  Active: "status-active",
  Moved: "status-moved",
  Event: "status-event",
  Maintenance: "status-maintenance",
  Standby: "status-standby"
};

export function KioskPerformanceTable({
  kiosks,
  rows,
  daysInMonth,
  selectedAssetId,
  onSelectAsset
}: KioskPerformanceTableProps) {
  const kioskMap = new Map(kiosks.map((kiosk) => [kiosk.assetId, kiosk]));

  return (
    <section className="panel table-panel">
      <div className="panel-header">
        <div>
          <h2>Kiosk tracking and performance</h2>
          <p>Device location, status, usage mix, language mix, rating, and failed-answer volume.</p>
        </div>
        <span className="panel-badge">{rows.length} kiosks</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Location</th>
              <th>Status</th>
              <th>Sessions</th>
              <th>Questions</th>
              <th>Avg/day</th>
              <th>Input usage</th>
              <th>Language</th>
              <th>Rating</th>
              <th>Success / Apology</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const kiosk = kioskMap.get(row.assetId);
              const selected = row.assetId === selectedAssetId;
              const totalInput = row.voice + row.quickReply + row.keyboard || 1;
              const totalLanguage = row.thai + row.english + row.chinese + row.others || 1;

              return (
                <tr
                  className={selected ? "selected-row" : ""}
                  key={row.assetId}
                  onClick={() => onSelectAsset(row.assetId)}
                >
                  <td>
                    <button className="asset-button" type="button">
                      <strong>{row.assetId}</strong>
                      <span>{kiosk?.screenSize ?? "Unknown screen"}</span>
                    </button>
                  </td>
                  <td>
                    <div className="location-cell">
                      <MapPin size={14} />
                      <span>{kiosk?.currentLocation ?? "Unknown location"}</span>
                    </div>
                    <small>{kiosk?.branch ?? "Unmapped branch"} · {kiosk?.locationPeriod ?? "No period"}</small>
                  </td>
                  <td>
                    <span className={`status-pill ${statusClass[kiosk?.status ?? "Standby"]}`}>
                      <Circle size={8} fill="currentColor" />
                      {kiosk?.status ?? "Standby"}
                    </span>
                  </td>
                  <td>{formatNumber(row.sessions)}</td>
                  <td>{formatNumber(row.questions)}</td>
                  <td>{formatNumber(row.questions / daysInMonth)}</td>
                  <td>
                    <div className="stacked-meter" title="Voice / Quick Reply / Keyboard">
                      <span style={{ width: `${(row.voice / totalInput) * 100}%` }} />
                      <span style={{ width: `${(row.quickReply / totalInput) * 100}%` }} />
                      <span style={{ width: `${(row.keyboard / totalInput) * 100}%` }} />
                    </div>
                    <small>V {formatPercent((row.voice / totalInput) * 100)} · QR {formatPercent((row.quickReply / totalInput) * 100)}</small>
                  </td>
                  <td>
                    <small>TH {formatPercent((row.thai / totalLanguage) * 100)} · EN {formatPercent((row.english / totalLanguage) * 100)}</small>
                  </td>
                  <td>{formatRating(row.rating)}</td>
                  <td>
                    <span className="success-text">{formatNumber(row.successAnswers)}</span>
                    <span className="muted"> / </span>
                    <span className="danger-text">{formatNumber(row.apologyAnswers)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="legend-row">
        <span><i className="legend-swatch voice" />Voice</span>
        <span><i className="legend-swatch quick" />Quick Reply</span>
        <span><i className="legend-swatch keyboard" />Keyboard</span>
        <span className="click-hint"><ArrowUpRight size={14} />Click a kiosk to view location timeline</span>
      </div>
    </section>
  );
}
