import * as Papa from 'papaparse';

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLxKh_BgtzfkkUmcixsAzj4MWgh3K--aigbSVzBIq7qw7FVhZVVz9xx4IwspHzVFl92QnlDYftxPBu/pub?gid=0&single=true&output=csv";

export async function loadPrograms() {
  const res = await fetch(SHEET_CSV_URL);
  const csvText = await res.text();

  return new Promise<any[]>((resolve) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,

      complete: (result: Papa.ParseResult<any>) => {
        resolve(result.data);
      },
    });
  });
}

