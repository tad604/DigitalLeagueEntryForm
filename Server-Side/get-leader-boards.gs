const scriptProp = PropertiesService.getScriptProperties();

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doGet(request){
  try{
    return ContentService
      .createTextOutput(JSON.stringify(getTheLeaderBoards()))
      .setMimeType(ContentService.MimeType.TEXT);
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
function getTheLeaderBoards(){
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("LeaderBoards");
  let lastRow = sheet.getLastRow();
  let num = parseFloat(lastRow / 19);
  let seasonCount = Math.ceil(num);
  let theLeaderBoards =[];
  for(let i = 0; i < seasonCount; i++){
    let season_start = (i * 19) + 1;
    let rows = sheet.getRange(season_start, 1,19, 5);  //season start, column 1, next 19 rows and column 5)
    let leaderBoard = getTheLeaderBoard(rows.getValues(), i);
    theLeaderBoards.push(leaderBoard);
  }
  return theLeaderBoards;
}

function getTheLeaderBoard(rows, i){
  let leaderBoard = {
    'name': rename(rows[1][0]),
    'targetThreshold': rows[0][2],
    'currentThreshold': rows[0][4],
    'order' : i,
    'leaders': []
  }
  for(let x = 2; x++; x < rows.length){
    let row = rows[x];
    if(row === undefined || row[0] === ''){
      break;
    }
    let leader = {
      'rank': row[0],
      'player': row[1],
      'gamesPlayed': row[2],
      'leagueScore': row[3],
      'winRate' : row[4]
    }
    leaderBoard.leaders.push(leader);
  }
  return leaderBoard;
}

function rename(name){
  return name.replace('Leaderboard', '');
}

function getLeaderBoard(){
  //todo: turn the league leader board into json  so it can get displayed
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("LeaderBoards");
  let rows = sheet.getRange(4, 1, 15, 5);
  return rowsToJson(rows);
}

function testGetTheLeaderBoards(){
  let json = getTheLeaderBoards();
  console.log(JSON.stringify(json));
}
