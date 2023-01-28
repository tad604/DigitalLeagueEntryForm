const scriptProp = PropertiesService.getScriptProperties()

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
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
  const sheet = doc.getSheetByName("NameMap");
  let allNames = sheet.getRange(2, 4, sheet.getLastRow());
  let values = allNames.getValues();
  let names = values.filter(function(row){
    return row[0];
  });
  return [].concat(...names);
}
