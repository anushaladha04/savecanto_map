import { useState, useEffect } from "react";
import Papa from "papaparse";
import type { CsvRow } from "../components/filters/types";

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTLxKh_BgtzfkkUmcixsAzj4MWgh3K--aigbSVzBIq7qw7FVhZVVz9xx4IwspHzVFl92QnlDYftxPBu/pub?gid=0&single=true&output=csv';

export function useCsvData() {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [csvLoading, setCsvLoading] = useState(true);
  const [csvError, setCsvError] = useState<string | null>(null);

  useEffect(() => {
    fetch(SHEET_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch CSV');
        return res.text();
      })
      .then(csvText => {
        const parsed = Papa.parse<CsvRow>(csvText, { 
          header: true, 
          skipEmptyLines: true,
          dynamicTyping: true
        });
        const rows = parsed.data.filter(row => typeof row === 'object' && row !== null);
        setCsvData(rows);
      })
      .catch(err => setCsvError(err.message))
      .finally(() => setCsvLoading(false));
  }, []);

  return { csvData, csvLoading, csvError };
}