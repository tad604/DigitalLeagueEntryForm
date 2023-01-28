const scriptProp = PropertiesService.getScriptProperties();

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doGet(request){
  try{
    let playerName = request.parameter.name;
    console.log("fetching stats for: " + playerName);
    let games = getAllPlayerGames(playerName);
    console.log(stats);
    return ContentService
      .createTextOutput(JSON.stringify(games))
      .setMimeType(ContentService.MimeType.TEXT);
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function getAllPlayerGames(playerName){
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("AllData")
  let games = [];
  let seasonEnds = findSeasonEnds();
  let allGames = sheet.getRange(3,1,sheet.getLastRow(), sheet.getLastColumn());
  let allPlayerGames = allGames.getValues().filter(function(row, idx){
    for(let i =1; i< 5; i++){
      if(row[i] === playerName){
        row.push(idx+3);  //AllData row_id
        row.push(findSeason(idx, seasonEnds ));
        return row;
      }
    }
  });
  allPlayerGames.forEach(function(row){
    games.push(convertRowToGame(row));
  })
  return games;
}

function test(){
  let games = getAllPlayerGames('Tad604');
  console.log("Number of games:  "+games.length);
  console.log(games);
}

function convertRowToGame(row){
  return {'id':row[row.length -2],
    'season':row[row.length -1],
    'timeStamp':row[0],
    'map': row[21],
    'deck': row[22],
    'player1': findPlayer(row, 1),
    'player2': findPlayer(row, 2),
    'player3': findPlayer(row, 3),
    'player4': findPlayer(row, 4)}
}
function findPlayer(row, idx){
  return {'name': findName(row, idx),
    'score': findScore(row, idx),
    'faction': findFaction(row, idx),
    'leagueScore': findLeagueScore(row,idx)}
}

function findLeagueScore(row, idx){
  let  playerIdx = findPlayerIdx(row, idx);
  return row[playerIdx+16];
}

function findFaction(row, idx){
  let  playerIdx = findPlayerIdx(row, idx);
  return row[playerIdx+4];
}


function findScore(row, idx){
  let  playerIdx = findPlayerIdx(row, idx);
  return row[playerIdx+12]
}

function findName(row, idx){
  let  playerIdx = findPlayerIdx(row, idx);
  return row[playerIdx];
}

function findPlayerIdx(row, idx){
  for(let i = 9; i <= 12; i++){
    if(idx === row[i]){
      return i - 8;
    }
  }
  return idx;
}

function testFindSeasonEnds(){
  console.log(findSeasonEnds());
}

function findSeason(idx, seasonEnds){
  for(let i =0; i < seasonEnds.length; i++){
    if((idx+3) <= seasonEnds[i]){
      let season = i+1;
      return "Season "+  season;
    }
  }
  return null;
}
function findSeasonEnds(){
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
  const sheet = doc.getSheetByName("Misc EoS Stats");
  let x = sheet.getRange(4, 3, sheet.getLastRow(), 1);
  return x.getValues().flat();
}
