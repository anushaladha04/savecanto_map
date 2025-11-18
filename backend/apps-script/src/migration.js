function migrateNewToApproval() {
  // ran onFormSubmit
  const ss = SpreadsheetApp.openById("1pUcB7jAyXFj7-BAmOh3M5ipWfLChn5CY1dH_0FPDXVE");
  const newSheet = ss.getSheetByName("NewPrograms");
  const approvalSheet = ss.getSheetByName("Approval");
  const correctionsSheet = ss.getSheetByName("Corrections");

  const data = newSheet.getDataRange().getValues();
  const approvalData = approvalSheet.getDataRange().getValues(); // for duplicate checking
  const geocoder = Maps.newGeocoder();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const action = row[2]; // C

    if (action === "Add a Cantonese program/添加一個粵語課程的資料") {
      // Columns D–L are indices 3–11
      const beforeJ = row.slice(3, 9); // D to I
      const address = row[10]; // K
      const raw_url = row.slice(11, 12); // L

      // Get latitude/longitude
      let lat = "";
      let lng = "";
      if (address && address.trim() !== "") {
        try {
          const response = geocoder.geocode(address);
          if (response.status === "OK" && response.results.length > 0) {
            const location = response.results[0].geometry.location;
            lat = location.lat;
            lng = location.lng;
          }
        } catch (e) {
          Logger.log("Geocoding failed for address: " + address + " - " + e);
        }
      }

      // Skip if lat/lng already exist together in Approval sheet
      const duplicate = approvalData.some(r => {
        return r.includes(lat) && r.includes(lng);
      });
      if (duplicate) {
        Logger.log(`Skipping duplicate for lat:${lat}, lng:${lng}, address: ${address}`);
        continue;
      }

      /* formatted_url = normalizeUrl(raw_url)
      if (formatted_url === "") {
        Logger.log(`Bad URL`);
        continue;
      }
      */

      // Combine data: D–I, address, lat, lng, L, then status columns
      const valuesToMove = [...beforeJ, address, lat, lng, raw_url, "needs_review"];

      // Find next empty row in Approval
      const targetRow = approvalSheet.getLastRow() + 1;

      // Write to Approval
      approvalSheet
        .getRange(targetRow, 1, 1, valuesToMove.length)
        .setValues([valuesToMove]);
    }
    else {
      // Get metadata fields from correction form
      const newAddress = row[21]; // Column V: "If updating location, what is the new address?"
      let lat = "";
      let lng = "";

      // Geocode new address (only if present)
      if (newAddress && newAddress.trim() !== "") {
        try {
          const geo = Maps.newGeocoder().geocode(newAddress);

          if (geo.status === "OK" && geo.results && geo.results.length > 0) {
            const loc = geo.results[0].geometry.location;
            lat = loc.lat;
            lng = loc.lng;
          }

        } catch (err) {
          Logger.log("Geocoding failed for: " + newAddress + " — " + err);
        }
      }

      // Build the row matching the Corrections sheet layout
      const status = "Not Applied (Pending)";

      const combinedData = [
        status,         // A: Status
        row[12],        // B: Current Name
        row[14],        // C: New Name
        row[15],        // D: New Type (New Audience)
        row[16],        // E: New City
        row[17],        // F: New State
        row[18],        // G: New Country
        row[19],        // H: New Level of Canto
        row[21],        // I: New Address
        lat,             // J: New Latitude (blank for corrections)
        lng,             // K: New Longitude (blank for corrections)
        row[22]         // L: New Website
      ];

      const targetRow = correctionsSheet.getLastRow() + 1;

      correctionsSheet
        .getRange(targetRow, 1, 1, combinedData.length)
        .setValues([combinedData]);
    }
  }
}

function migrateLegacyToApproval() {
  // DONT RUN THIS FUNCTION ANYMORE! ONE-TIME LEGACY MIGRATION COMPLETE!
  const props = PropertiesService.getScriptProperties();
  const sheetIdOld = props.getProperty('SHEET_ID_OLD');
  const sheetIdNew = props.getProperty('SHEET_ID_NEW');
  const tabOld = props.getProperty('TAB_OLD1');
  const tabNew = props.getProperty('TAB_NEW');

  const oldSheet = SpreadsheetApp.openById(sheetIdOld).getSheetByName(tabOld);
  const approvalSheet = SpreadsheetApp.openById(sheetIdNew).getSheetByName(tabNew);

  const oldData = oldSheet.getDataRange().getValues();
  const approvalData = approvalSheet.getDataRange().getValues();

  const K = 10;

  const existingWebsites = new Set(
    approvalData
      .slice(1)
      .map(r => normalizeUrl(r[9])) 
      .filter(Boolean)
  );

  const rowsToAdd = [];

  for (let i = 2; i < oldData.length; i++) { // skip header row and filter row
    const row = oldData[i];
    const website = row[9]; // website column index

    if (!website) continue;

    const normalized = normalizeUrl(website);
    if (!normalized || existingWebsites.has(normalized)) continue;

    const newRow = row.slice(0, K);
    newRow.push("needs_review");

    rowsToAdd.push(newRow);
    existingWebsites.add(normalized);
  }

  if (rowsToAdd.length > 0) {
    approvalSheet
      .getRange(approvalData.length + 1, 1, rowsToAdd.length, K + 1)
      .setValues(rowsToAdd);
  }

  // formatting sheet
  const numCols = K + 1;
  const columnWidths = [ // adjust widths manually (in pixels)
    220, // 1. Program Name
    140, // 2. Audience
    180, // 3. City
    140, // 4. State/Province
    160, // 5. Country
    220, // 6. Level of Cantonese
    350, // 7. Address
    120, // 8. Latitude
    120, // 9. Longitude
    300, // 10. Website
    120  // 11. Website Verification
  ];

  for (let c = 1; c <= numCols; c++) {
    approvalSheet.setColumnWidth(c, columnWidths[c - 1] || 150);
  }

  const lastRow = approvalSheet.getLastRow() || 1;
  const numRows = Math.max(rowsToAdd.length, lastRow - 1);
  const formatRange = approvalSheet.getRange(2, 1, numRows, numCols);

  approvalSheet.unhideRow(formatRange);
  formatRange
    .setWrap(true)
    .setVerticalAlignment("middle")
    .setFontSize(11)
    .setFontFamily("Arial")
    .setBackground("#ffffff");

  approvalSheet.setRowHeights(2, numRows, 21);
  approvalSheet.setFrozenColumns(1);

  Logger.log(`Added ${rowsToAdd.length} new programs to Approval.`);

  // checkWebsitesAndUpdateSheet();
}

// ngl not sure if this is being used
function normalizeUrl(url) {
  if (url == null) return ""; // handles null and undefined
  const str_url = String(url);    // ensure it's a string
  if (!str_url.startsWith("https://")) return "";
  return str_url.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}