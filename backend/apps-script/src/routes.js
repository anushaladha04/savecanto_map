function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ message: 'Hello from Apps Script!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  return ContentService
    .createTextOutput(JSON.stringify({ received: data }))
    .setMimeType(ContentService.MimeType.JSON);
}