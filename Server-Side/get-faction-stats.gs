const scriptProp = PropertiesService.getScriptProperties();
const seasonDataWidth = 3;
const factionDataStart = 5;
const factionDataLength = 18;

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doGet(request){
  try{
    return ContentService
      .createTextOutput(JSON.stringify(getAllFactionStats()))
      .setMimeType(ContentService.MimeType.TEXT);
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
function testGetSeasonCount(){
  let x = this.getSeasonCount();
  return x;
}
function getSeasonCount(){
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("FactionStats");
  return ((sheet.getLastColumn() - 1) / seasonDataWidth) - 1;
}
function getAllFactionStats(){
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName("FactionStats");
  let rows = sheet.getRange(factionDataStart, 1, factionDataLength, sheet.getLastColumn());

  let factionStats = {};

  let seasonCount = getSeasonCount();
  for(let i = 0; i <= seasonCount; i++){
    if(i==0){
      factionStats['allTime'] = getSeasonFactionStats(i, rows);
    } else {
      factionStats['season'+i] = getSeasonFactionStats(i, rows);
    }
  }
  return factionStats;
}

function getSeasonFactionStats(season, rows){

  let seasonFactionStats = {'factions': rowsToJson(season, rows),
    'name': season == 0 ? 'All Seasons' : 'Season '+ season,
    'order': season == 0 ? Number.MAX_VALUE : season};
  return seasonFactionStats;
}

function getFactionMiscStats(){
let miscStats = {};

}


function rowsToJson(season, rows){
  let factions = [];
  seasonIdx = seasonDataWidth * season;

  rows.getValues().forEach(function(row, index){
    var faction = {
      'order' : index,
      'faction': row[0],
      'gamesPlayed': row[seasonIdx + 1],
      'leagueScore': row[seasonIdx+2],
      'winRate' : row[seasonIdx+3]
    }
    factions[index] = faction;
  });
  return factions;
}
function testGetAllFactionStats(){
  let json = getAllFactionStats();
  console.log(json);
}
