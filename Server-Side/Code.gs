const scriptProp = PropertiesService.getScriptProperties()

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function testLeaderBoard(){
  return getLeaderBoard();
}


function testSuggest(){
  return getNameSuggestions('T');
}

function doGet(request){

  let fnc = request.parameter['fnc'];

  try{
    if(fnc === "suggest"){
      return getNameSuggestions(request.parameter['text']);
    }else if(fnc ==="leaderBoard"){
      return getLeaderBoard();
    }else{
      return ContentService.createTextOutput(JSON.stringify({'result': 'error', 'unsupported': fnc}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function getLeaderBoard(){
  //todo: turn the league leader board into json  so it can get displayed
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("LeaderBoards");
  var rows = sheet.getRange(4, 1, 15, 5);
  let leaders =[];
  rows.getValues().forEach(function(row, index){
    var leader = {
      'rank': row[0],
      'player': row[1],
      'gamesPlayed': row[2],
      'leagueScore': row[3],
      'winRate' : row[4]
    }
    leaders[index] = leader;
  });

  return ContentService.createTextOutput(JSON.stringify(leaders)).setMimeType(ContentService.MimeType.TEXT);
}

function getNameSuggestions(partial){
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("NameMap")
  var allNames = sheet.getRange(2, 4, sheet.getLastRow())
  Logger.log(partial);
  try{
    var values = allNames.getValues()
    var suggestions = values.filter(function(row){
      if (row[0].startsWith(partial)) {
        return row[0];
      }
    });
    let flat = [].concat(...suggestions);
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
