function moveApprovedRows() {
  const sourceSheetName = "Approval";
  const targetSheetName = "SaveCantoPrograms";
  const statusColumn = 12;       // Column L (Approval Status)
  const transferredColumn = 13;  // Column M (Transfer Marker)
  const approvedValue = "Approved";
  const transferredMarker = "Transferred";

  const ss = SpreadsheetApp.openById("1t_dFtkP5DI4C-B9SF7_b9bTED6bvdRS4EHDGdv93baI");
  const sourceSheet = ss.getSheetByName(sourceSheetName);
  const targetSheet = ss.getSheetByName(targetSheetName);

  if (!sourceSheet) throw new Error("Source sheet not found!");
  if (!targetSheet) throw new Error("Target sheet not found!");

  const data = sourceSheet.getDataRange().getValues();
  const approvedRows = [];
  const rowsToMark = [];

  // store all target sheet data for comparison (anusha)
  const targetData = targetSheet.getDataRange().getValues();

  // Loop through rows (skip header)
  for (let i = 1; i < data.length; i++) {
    const status = (data[i][statusColumn - 1] || "").toString().trim();
    const transferStatus = (data[i][transferredColumn - 1] || "").toString().trim();
    const programName = (data[i][0] || "").toString().trim(); // assumes first column is unique ID (anusha)

    // Only Approved and not yet Transferred
    if (status === approvedValue && transferStatus !== transferredMarker) {
      approvedRows.push(data[i]);
      rowsToMark.push(i + 1); // +1 for sheet row index
    }

    // anusha: was approved before, now denied + removed from target
    if (status !== approvedValue && transferStatus === transferredMarker) {
      for (let j = 1; j < targetData.length; j++) {
        const targetProgram = (targetData[j][0] || "").toString().trim();
        if (targetProgram === programName) {
          targetSheet.deleteRow(j + 1);
          break;
        }
      }
      sourceSheet.getRange(i + 1, transferredColumn).setValue("");
    }
  }

  Logger.log(`Found ${approvedRows.length} rows to transfer.`);

  if (approvedRows.length === 0) return; // nothing new to transfer

  // Remove protection temporarily
  const protections = targetSheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  protections.forEach(p => p.remove());

  // Append all approved rows at once
  const startRow = targetSheet.getLastRow() + 1;
  targetSheet
    .getRange(startRow, 1, approvedRows.length, approvedRows[0].length)
    .setValues(approvedRows);

  // Re-apply read-only protection
  const protection = targetSheet.protect();
  protection.setDescription('Read-only sheet for approved rows');
  protection.removeEditors(protection.getEditors());
  if (protection.canDomainEdit()) protection.setDomainEdit(false);

  // Mark transferred rows in source sheet (Column M)
  rowsToMark.forEach(rowIndex => {
    sourceSheet.getRange(rowIndex, transferredColumn).setValue(transferredMarker);
  });

  Logger.log(`Transferred ${approvedRows.length} rows and marked them as "${transferredMarker}".`);
}

function onEdit(e) {
  const sheet = e.range.getSheet();
  const editedColumn = e.range.getColumn();
  const approvalSheetName = "Approval"; 
  const approvalStatusColumn = 12; // Column L

  // Only trigger if we're on the Approval sheet, editing the Approval Status column
  if (sheet.getName() === approvalSheetName && editedColumn === approvalStatusColumn) {
    const ui = SpreadsheetApp.getUi();
    const cell = e.range;
    const newValue = cell.getValue();

    // Show confirmation dialog
    const response = ui.alert(
      "Confirm Approval or Denial",
      `You selected "${newValue}".\n\n⚠️ Please confirm this action.\nAn email will be sent to the submitter notifying them that their program has been ${newValue.toLowerCase()}.`,
      ui.ButtonSet.OK_CANCEL
    );

    // If user cancels, revert to previous value
    if (response === ui.Button.CANCEL) {
      cell.setValue(e.oldValue || ""); // revert to blank or previous
      ui.alert("Action cancelled — no status change was saved.");
    }
  }
}

