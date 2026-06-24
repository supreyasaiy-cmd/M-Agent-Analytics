import Papa from "papaparse";
import * as XLSX from "xlsx";
import { ImportedDataset } from "../types/dashboard";

function normalizeRows(rows: unknown[][], headers: string[]): Record<string, unknown>[] {
  return rows.slice(0, 8).map((row) =>
    headers.reduce<Record<string, unknown>>((record, header, index) => {
      record[header || `Column ${index + 1}`] = row[index] ?? "";
      return record;
    }, {})
  );
}

export async function parseImportFile(file: File): Promise<ImportedDataset> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    const text = await file.text();
    const result = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
    const preview = result.data.slice(0, 8);
    const columns = result.meta.fields ?? Object.keys(preview[0] ?? {});
    return {
      fileName: file.name,
      rowCount: result.data.length,
      columns,
      preview
    };
  }

  if (extension === "xlsx" || extension === "xls") {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const firstSheet = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheet];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
    const headers = (rows[0] ?? []).map((value, index) => String(value || `Column ${index + 1}`));
    return {
      fileName: file.name,
      rowCount: Math.max(0, rows.length - 1),
      columns: headers,
      preview: normalizeRows(rows.slice(1), headers)
    };
  }

  throw new Error("Please upload a CSV, XLS, or XLSX file.");
}
