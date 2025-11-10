function moveApprovedRows(e) {
  if (!e) return;

  const sheet = e.range.getSheet();
  const editedRow = e.range.getRow();
  const editedCol = e.range.getColumn();
  const statusColumn = 12; // Column L
  const transferredColumn = 13; // Column M

  // Early exit if wrong sheet or column
  if (sheet.getName() !== "Approval" || editedCol !== statusColumn) return;

  const newValue = (e.value || "").toString().trim();
  const oldValue = (e.oldValue || "").toString().trim();

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    const transferred = sheet.getRange(editedRow, transferredColumn).getValue().toString().trim();
    const targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SaveCantoPrograms");

    // Newly approved → Transfer to SaveCantoPrograms
    if (newValue === "Approved" && transferred !== "Transferred") {
      sheet.getRange(editedRow, transferredColumn).setValue("Transferred");
      SpreadsheetApp.flush();
      
      const rowData = sheet.getRange(editedRow, 1, 1, sheet.getLastColumn()).getValues()[0];
      targetSheet.appendRow(rowData);
    }

    // Unapproved → Remove from SaveCantoPrograms
    if (oldValue === "Approved" && newValue !== "Approved" && transferred === "Transferred") {
      const programName = sheet.getRange(editedRow, 1).getValue();
      const targetData = targetSheet.getDataRange().getValues();
      
      for (let j = 1; j < targetData.length; j++) {
        if ((targetData[j][0] || "").toString().trim() === programName) {
          targetSheet.deleteRow(j + 1);
          break;
        }
      }

      sheet.getRange(editedRow, transferredColumn).setValue("");
    }
  } catch (err) {
    Logger.log('Error in moveApprovedRows: ' + err);
  } finally {
    lock.releaseLock();
  }
}