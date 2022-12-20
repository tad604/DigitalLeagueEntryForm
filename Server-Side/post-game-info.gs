const scriptProp = PropertiesService.getScriptProperties();
function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)
  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    const sheet = doc.getSheetByName("HtmlPostInput")
    const headers = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0]
    const nextRow = sheet.getLastRow() + 1
    var date = [[Utilities.formatDate(new Date(), "UTC", "yyyy-MM-dd HH:mm")]];
    const newRow = headers.map(function(header) {
      return header === 'Timestamp' ? date : e.parameter[header]
    })
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow, 'data':e}))
      .setMimeType(ContentService.MimeType.JSON)
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
  finally {
    lock.releaseLock()
  }
}
