import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { ImportedDataset } from "../types/dashboard";
import { parseImportFile } from "../utils/importData";

export function DataImportPanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dataset, setDataset] = useState<ImportedDataset | null>(null);
  const [error, setError] = useState("");

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      setDataset(await parseImportFile(file));
    } catch (parseError) {
      setDataset(null);
      setError(parseError instanceof Error ? parseError.message : "Could not read the file.");
    }
  }

  return (
    <section className="panel import-panel">
      <div className="panel-header">
        <div>
          <h2>Data import</h2>
          <p>Upload CSV, XLS, or XLSX. Missing fields are tolerated; this panel previews what is available.</p>
        </div>
        <FileSpreadsheet size={20} />
      </div>
      <div className="import-layout">
        <input
          accept=".csv,.xls,.xlsx"
          onChange={handleFile}
          ref={inputRef}
          style={{ display: "none" }}
          type="file"
        />
        <button className="upload-button" onClick={() => inputRef.current?.click()} type="button">
          <UploadCloud size={18} />
          Upload monthly backend data
        </button>
        <div className="sample-format">
          <strong>Suggested fields</strong>
          <p>month, assetId, branch, location, sessions, questions, voice, quickReply, keyboard, language, rating, status, userQuestion, aiAnswer, issueType, correctAnswer</p>
        </div>
      </div>
      {error ? <p className="error-message">{error}</p> : null}
      {dataset ? (
        <div className="import-preview">
          <strong>{dataset.fileName}</strong>
          <span>{dataset.rowCount} rows · {dataset.columns.length} columns</span>
          <div className="column-chips">
            {dataset.columns.slice(0, 14).map((column) => <span key={column}>{column}</span>)}
          </div>
        </div>
      ) : null}
    </section>
  );
}
