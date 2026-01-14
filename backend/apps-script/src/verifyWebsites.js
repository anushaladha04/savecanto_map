function checkWebsitesAndUpdateSheet(rowNumber) {
  const approvalSheetName = "Approval";
  const websiteColumn = 10;       // Column J (URLs)
  const verifiedColumn = 11;      // Column K (Status)

  const ss = SpreadsheetApp.openById(
    "1t_dFtkP5DI4C-B9SF7_b9bTED6bvdRS4EHDGdv93baI"
  );
  const sheet = ss.getSheetByName(approvalSheetName);

  if (!sheet) throw new Error("Approval sheet not found!");

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return; // no data

  // ============================================================
  // DECIDE MODE: Single-row mode or full-sheet mode
  // ============================================================

  let rowsToProcess = [];

  if (rowNumber && Number(rowNumber) > 1) {
    // User wants to verify ONE specific row
    const r = Number(rowNumber);

    if (r > lastRow) {
      throw new Error(`Row ${r} is outside data range.`);
    }

    rowsToProcess = [r];
  } else {
    // Verify ALL rows (2 through lastRow)
    rowsToProcess = Array.from({ length: lastRow - 1 }, (_, i) => i + 2);
  }

  // ============================================================
  // PROCESS THE ROWS
  // ============================================================

  rowsToProcess.forEach(r => {
    const url = sheet.getRange(r, websiteColumn).getValue();
    let status = "needs_review";

    if (url) {
      try {
        const response = UrlFetchApp.fetch(url, {
          muteHttpExceptions: true,
          followRedirects: true
        });

        const code = response.getResponseCode();

        if (code >= 200 && code < 300) {
          status = "verified";
        } else if (code === 404 || code === 500) {
          status = "inactive";
        } else {
          status = "needs_review";
        }

        Logger.log(`Row ${r} | URL: ${url} | Code: ${code} | Status: ${status}`);

      } catch (e) {
        status = "needs_review";
        Logger.log(`Row ${r} | URL: ${url} | Status: ${status} | Error: ${e}`);
      }
    } else {
      Logger.log(`Row ${r} has no URL.`);
    }

    // Update the sheet
    sheet.getRange(r, verifiedColumn).setValue(status);
  });

  Logger.log(
    rowsToProcess.length === 1
      ? `Verified URL for row ${rowsToProcess[0]}.`
      : `Verified ${rowsToProcess.length} rows.`
  );
}
