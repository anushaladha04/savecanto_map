function checkWebsitesAndUpdateSheet() {
  const approvalSheetName = "Approval";
  const websiteColumn = 10;       // Column J (URLs)
  const verifiedColumn = 11;      // Column K (Status)

  const ss = SpreadsheetApp.openById("1t_dFtkP5DI4C-B9SF7_b9bTED6bvdRS4EHDGdv93baI"); 
  const sheet = ss.getSheetByName(approvalSheetName);
  
  if (!sheet) throw new Error("Approval sheet not found!");

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return; // no data

  // Get all URLs from column J (excluding header)
  const urlRange = sheet.getRange(2, websiteColumn, lastRow - 1, 1);
  const urls = urlRange.getValues(); // 2D array

  const results = [];

  urls.forEach((row, i) => {
    const url = row[0];
    let status = "needs_review";

    if (url) {
      try {
        const response = UrlFetchApp.fetch(url, {
          muteHttpExceptions: true,
          followRedirects: true
        });
        const code = response.getResponseCode();

        if (code >= 200 && code < 300) status = "verified";
        else if (code === 404 || code === 500) status = "inactive";
        else status = "needs_review";

        Logger.log(`URL: ${url} | Code: ${code} | Status: ${status}`);

      } catch (e) {
        status = "needs_review";
        Logger.log(`URL: ${url} | Status: ${status} | Error: ${e}`);
      }
    } else {
      Logger.log(`Row ${i + 2} is empty.`);
    }

    results.push([status]); // store as 2D array for setValues
  });

  // Write results back to verifiedColumn
  const resultRange = sheet.getRange(2, verifiedColumn, results.length, 1);
  resultRange.setValues(results);
}

