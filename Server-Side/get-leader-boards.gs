const scriptProp = PropertiesService.getScriptProperties();
/*
this map is fragile/would need to change for every season
*/
const seasonMap = {
  'season1':{'start':151, 'size':10, 'order': 1},
  'season2':{'start':138, 'size':10, 'order': 2},
  'season3':{'start':120, 'size':15, 'order': 3},
  'season4':{'start':102, 'size':15, 'order': 4},
  'season5':{'start':83, 'size':15, 'order': 5},
  'season6':{'start':64, 'size':15, 'order': 6},
  'season7':{'start':44, 'size':15, 'order': 7},
  'season8':{'start':23, 'size':15, 'order': 8}
}

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doGet(request){
  try{
    return ContentService
      .createTextOutput(JSON.stringify(getAllLeaderBoards()))
      .setMimeType(ContentService.MimeType.TEXT);
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function getAllLeaderBoards(){
  let leaderBoards = {
    'allTime':{'players':getLeaderBoard(),
      'name':'All Seasons'}
  };
  for(const season in seasonMap){
    leaderBoards[season] = getSeasonLeaderBoard(seasonMap[season]);
  }
  return leaderBoards;
}

function getSeasonLeaderBoard(season){
  //todo: turn the league leader board into json  so it can get displayed
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("LeaderBoards");
  let rows = sheet.getRange(season.start, 1, season.size, 5);
  let seasonLeaderBoard = {'players': rowsToJson(rows),
    'name': 'Season '+ season['order'],
    'order': season['order']};
  return seasonLeaderBoard;
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

function testGetallLeaderBoards(){
  let json = getAllLeaderBoards();
  console.log(json);
}
