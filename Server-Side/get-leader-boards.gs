const scriptProp = PropertiesService.getScriptProperties();
function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}
function testLeaderBoard(){
  return getLeaderBoard();
}
function doGet(request){
  try{
      let leaderBoards = {
        'allTime':getLeaderBoard(),
        'season':getSeasonLeaderBoard()
      };
      return  ContentService.createTextOutput(JSON.stringify( leaderBoards)).setMimeType(ContentService.MimeType.TEXT);
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
function getSeasonLeaderBoard(){
  //todo: turn the league leader board into json  so it can get displayed
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("LeaderBoards");
  let rows = sheet.getRange(23, 1, 15, 5);
  return rowsToJson(rows);
}
function getLeaderBoard(){
  //todo: turn the league leader board into json  so it can get displayed
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("LeaderBoards");
  let rows = sheet.getRange(4, 1, 15, 5);
  return rowsToJson(rows);
}
function rowsToJson(rows){
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
return leaders;
}
