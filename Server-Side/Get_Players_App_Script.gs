const scriptProp = PropertiesService.getScriptProperties()

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function testGetNames(){
  return getPlayerNames();
}

function doGet(request){
  try{
    let playerNames = getPlayerNames();
    return ContentService
      .createTextOutput(JSON.stringify(playerNames))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function getPlayerNames(){
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("NameMap")
  var allNames = sheet.getRange(2, 4, sheet.getLastRow())
  try{
    var values = allNames.getValues()
    var names = values.filter(function(row){
      return row[0];
    });
    let flat = [].concat(...names);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'suggestions': flat}))
      .setMimeType(ContentService.MimeType.JSON)
  }
  catch (e) {
    Logger.log(e);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error returning suggestions', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
