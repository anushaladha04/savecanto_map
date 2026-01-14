function migrateNewToApproval(e) {
  const ss = SpreadsheetApp.openById(
    "1t_dFtkP5DI4C-B9SF7_b9bTED6bvdRS4EHDGdv93baI"
  );
  const newSheet = ss.getSheetByName("NewPrograms");
  const approvalSheet = ss.getSheetByName("Approval");
  const correctionsSheet = ss.getSheetByName("Corrections");

  const approvalData = approvalSheet.getDataRange().getValues();
  const geocoder = Maps.newGeocoder();
  save_canto_email = "haydn@g.ucla.edu" // UPDATE EVENTUALLY

  // e.values = the submitted row (array)
  const row = e.values;
  const submitter_email = row[1];
  const timestamp = row[0];
  
  // IMPORTANT: Make sure indices match your sheet exactly.
  const action = row[2]; // Column C

  // ---------- NEW PROGRAMS FLOW ----------
  if (action === "Add a Cantonese program/添加一個粵語課程的資料") {
    const beforeJ = row.slice(3, 9); // D to I
    const address = row[10]; // K
    const raw_url = row.slice(11, 12); // L

    // ----- Geocode address -----
    let lat = "";
    let lng = "";
    if (address && address.trim() !== "") {
      try {
        const response = geocoder.geocode(address);
        if (response.status === "OK" && response.results.length > 0) {
          const loc = response.results[0].geometry.location;
          lat = loc.lat;
          lng = loc.lng;
        }
      } catch (err) {
        Logger.log("Geocoding failed for: " + address + " - " + err);
      }
    }

    // ----- Build Approval row -----
    const valuesToMove = [
      ...beforeJ,
      address,
      lat,
      lng,
      raw_url,
      "needs_review",

    ];

    const targetRow = approvalSheet.getLastRow() + 1;
    approvalSheet
      .getRange(targetRow, 1, 1, valuesToMove.length)
      .setValues([valuesToMove]);
    approvalSheet.getRange(targetRow, 14, 1, 1).setValue(submitter_email);
    approvalSheet.getRange(targetRow, 15, 1, 1).setValue(timestamp);
    sendEmailNotif("Submission", save_canto_email, row[3], timestamp);
    
    checkWebsitesAndUpdateSheet(targetRow);
    approvalSheet.getRange(targetRow, 12).setValue("Pending Approval");
  }

  // ---------- CORRECTIONS FLOW ----------
  const newAddress = row[21]; // Column V
  let lat = "";
  let lng = "";

  if (newAddress && newAddress.trim() !== "") {
    try {
      const geo = Maps.newGeocoder().geocode(newAddress);
      if (geo.status === "OK" && geo.results && geo.results.length > 0) {
        const loc = geo.results[0].geometry.location;
        lat = loc.lat;
        lng = loc.lng;
      }
    } catch (err) {
      Logger.log("Geocoding failed for: " + newAddress + " - " + err);
    }
  }

  const status = "Not Applied (Pending)";
  const combinedData = [
    status,         // A
    row[12],        // B current name
    row[14],        // C new name
    row[15],        // D new type
    row[16],        // E new city
    row[17],        // F new state
    row[18],        // G new country
    row[19],        // H new level
    row[21],        // I new address
    lat,            // J new lat
    lng,            // K new lng
    row[22],        // L new website
  ];
  
  const targetRow = correctionsSheet.getLastRow() + 1;
  correctionsSheet
    .getRange(targetRow, 1, 1, combinedData.length)
    .setValues([combinedData]);

  
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

    const normalized = normalizeUrl(website);

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