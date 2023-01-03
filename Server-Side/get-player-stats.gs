const scriptProp = PropertiesService.getScriptProperties();
const factionDataStart = 2;
const factionDataLength = 2;
const factionHeadingsRow = 3

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doGet(request){
  try{
    let playerName = request.parameter.name;
    console.log("fetching stats for: " + playerName);
    let stats = getPlayerStats(playerName);
    console.log(stats);
    return ContentService
      .createTextOutput(JSON.stringify(stats))
      .setMimeType(ContentService.MimeType.TEXT);
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function getPlayerStats(playerName){
  let stats = getPlayerStatsRow(playerName);
  let factions = [];
  let turnOrderStats = [];
  let miscStats = [];
  if(stats){
    let factionNames = getFactions();
    for(let i = 0; i < factionNames.length; i++){
      let idx = i * factionDataLength +1;
      let name = factionNames[i];
      if(isNaN(name)){
        if(name.startsWith('*')){
          let miscStat = {
            'order': miscStats.length + 1,
            'name' : name,
            'gamesPlayed': stats[idx],
            'leagueScore': calculateScore(stats[idx], stats[idx+1]),
            'winRate' : stats[idx+1] * 100
          }
          miscStats.push(miscStat);
        }else{
          let faction = {
            'order'  : factions.length + 1,
            'faction':factionNames[i],
            'gamesPlayed': stats[idx],
            'leagueScore': calculateScore(stats[idx], stats[idx+1]),
            'winRate' : stats[idx+1] * 100
          }
          factions.push(faction);
        }
      }else{
        let turnOrderStat = {
          'order'  : factionNames[i],
          'faction': 'Turn '+ factionNames[i],
          'gamesPlayed': stats[idx],
          'leagueScore': calculateScore(stats[idx], stats[idx+1]),
          'winRate' : stats[idx+1] * 100
        }
        turnOrderStats.push(turnOrderStat);
      }
    }
  }
  let playerStats =
    {'name':playerName,
      'factions': factions,
      'turnOrderStats': turnOrderStats,
      'miscStats': miscStats
    };
  return playerStats;
}

function calculateScore(games, winRate){
  if(isNaN(games) || isNaN(winRate)){
    return '';
  }else{
    return  Math.round(games * winRate * 10) / 10;
  }
}


function getPlayerStatsRow(playerName){
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("PlayerStats");
  let cells =  sheet.getRange(factionHeadingsRow+1, 1,sheet.getLastRow(), sheet.getLastColumn()).getValues();
  let playerStats = [];
  let playerFound = false;
  for(let i = 0; i < cells.length; i++){
    if(cells[i][0] == playerName){
      playerStats = cells[i];
      playerFound = true;
      break;
    }
  }
  if(playerFound){
    return playerStats;
  } else {
    return false;
  }
}

function getFactions(){
  let factions = [];
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("PlayerStats");
  let factionRow = sheet.getRange(factionHeadingsRow, factionDataStart, 1, sheet.getLastColumn()).getValues()[0];
  factionRow.forEach(value => {
    if(value){
      factions.push(value);
    }
  });
  return factions;
}

function rowsToJson(row){
  let factions = getFactions();
}

function testGetplayerStats(){
  let json = getPlayerStats('Tad604');
  console.log(json);
}
function testGetAllFactions (){
  let json = getFactions();
  console.log(json);
}
