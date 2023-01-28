GOOGLE_SHEET_GET_ALL_PLAYER_GAMES = "https://script.google.com/macros/s/AKfycbyGFvXOCaImTwo3EkTQ4bLkQFZp3ocabGB0R5lMLI0mtBKHuRqwVriT4rkRv-WpNDA4Cg/exec";
let allGames = [];
let filter = {'maps':[], 'decks': [],  'seasons': [], 'opponents':[], 'player':{ 'faction':'', 'victory':'', 'turnOrder':'', 'name':''}};  //empty filter  fetch from form?


const domImages = {
  'Bird':'card-bird.png',
  'Bunny':'card-bunny.png',
  'Fox':'card-fox.png',
  'Mouse':'card-mouse.png'
}
const factionImages = {
  'Eyrie Dynasties':'Eyrie_Warrior.png',
  'Lizard Cult':'Lizard_Cult_Warrior.png',
  'Marquise de Cat': 'Cat_Warrior.png',
  'Riverfolk': 'Riverfolk_Warrior.png',
  'Woodland Alliance': 'Alliance_Warrior.png',
  'Vagabond (Adventurer)': 'Vagabond_Adventurer.png',
  'Vagabond (Arbiter)': 'Vagabond_Arbiter.png',
  'Vagabond (Harrier)': 'Vagabond_Harrier.png',
  'Vagabond (Ranger)': 'Vagabond_Ranger.png',
  'Vagabond (Ronin)': 'Vagabond_Ronin.png',
  'Vagabond (Scoundrel)': 'Vagabond_Scoundrel.png',
  'Vagabond (Thief)': 'Vagabond_Thief.png',
  'Vagabond (Tinker)': 'Vagabond_Tinker.png',
  'Vagabond (Vagrant)': 'Vagabond_Vagrant.png',
  'Underground Duchy': 'Duchy_Warrior.png',
  'Corvid Conspiracy': 'Corvid_Warrior.png',
  'Keepers in Iron': 'Badger_Warrior.png',
  'Lord of the Hundreds': 'Rat_Warrior.png'
}
const mapImages = {
  'Autumn':'autumn.jpg',
  'Winter':'winter.jpg',
  '':'Ability_Berry_sm.png'
}
const deckImages = {
  'Base':'baseDeck.gif',
  'E&P':'ExilesAndPartisansDeck.gif'
}

window.addEventListener("load", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  document.getElementById('playerNameLookUp').value = urlParams.get('playerName');
  fetchPlayerGames();
});

function fetchPlayerGames() {
  let playerName = document.getElementById('playerNameLookUp').value;
  if (playerName === "") {
        //show nothing
  } else {
  showLoading();
  fetch(GOOGLE_SHEET_GET_ALL_PLAYER_GAMES + "?name=" + encodeURIComponent(playerName)).then((response) => response.json()).then((data) => {
    console.log(data);
    allGames = data;
    loadPlayerGames();
    showLoaded();
  }).catch(function (e) {
    showFailedToLoad(e);
  });
  }
}

function showLoading(){
  let dummyTbody = document.getElementById('dummy-tbody');
  dummyTbody.hidden = false;
  let tbody = document.getElementById('games');
  tbody.hidden = true;
  tbody.innerHTML ="";
  document.getElementById('playerNameLookUp').disabled = true;
  document.getElementById('lookUpButton').disabled = true;
}

function showLoaded(){
  let dummyTbody = document.getElementById('dummy-tbody');
  dummyTbody.hidden = true;
  let tbody = document.getElementById('games');
  tbody.hidden = false;
  document.getElementById('playerNameLookUp').disabled = false;
  document.getElementById('lookUpButton').disabled = false;
}

function showNoResultsToLoad(){
  let tbody = document.getElementById('games');
  tbody.innerHTML = 'No Results found!!!';
  showLoaded();
}

function showFailedToLoad(e){
  console.log(e);
  if(confirm("Failed to retrieve player games!!  Try again?")){
  }else{
    showNoResultsToLoad();
  }
}

function createBasicTd( content){
  let td = document.createElement('td');
  td.innerHTML = content;
  return td;
}


function createImg(content){
  let img = document.createElement('img');
  img.src = "img/"+content;
  img.alt = content;
  let td = createBasicTd('');
  td.append(img);
  return td;
}


function checkPlayerFactions(img, player, score){
  let x = score.toLowerCase();
  if(x.includes(player.faction.toLowerCase())){
    img.src ="img/"+ factionImages[player.faction];
  }
}

function findCoalitionImage(score, game){
  let img = document.createElement('img');
  img.alt = score;
  img.src = 'img/generic-meeple.png';
  checkPlayerFactions(img, game.player1, score);
  checkPlayerFactions(img, game.player2, score);
  checkPlayerFactions(img, game.player3, score);
  checkPlayerFactions(img, game.player4, score);
  return img;
}

function findDomImage(score){
  let img = document.createElement('img');
  img.alt = score;
  let x = score.toLowerCase();
  if(x.includes('bun') || x.includes('rab')){
    img.src ="img/"+ domImages['Bunny'];
  }else if(x.includes('bird')){
    img.src = "img/"+domImages['Bird'];
  }else if(x.includes('fox')){
    img.src ="img/"+ domImages['Fox'];
  }else if(x.includes('mouse')){
    img.src ="img/"+ domImages['Mouse'];
  }else{
    img.src = 'img/generic-meeple.png';
    console.log("unknown dom?"+score);
  }
  return img;
}

function createScore(score, game){
  let span = document.createElement('span');
  if(isNaN(score)){
    if(score.toLowerCase().includes('dom')){
      span.append(findDomImage(score));
    }else if (score.toLowerCase().includes('coal')){
      span.append(findCoalitionImage(score, game));
    }
  }else{
    span.textContent = score;
  }
  span.classList.add('score');
  return span;
}

function createPlayerTd(player,game){
  let td = document.createElement('td');
  if(player.leagueScore > 0){
    let trophy= document.createElement('img');
    trophy.src = "img/trophy.svg";
    td.append(trophy);
  }
  let img = document.createElement('img');
  let fImg = factionImages[player.faction];
  if(fImg === undefined){
    console.log('undefined faction image: '+ player.faction + " : "+ game.id);
    fImg = 'generic-meeple.png';
  }
  img.src = "img/"+fImg;
  td.append(img);
  let nameSpan = document.createElement('span');
  nameSpan.textContent = player.name;
  td.append(nameSpan);
  td.append(createScore(player.score, game));
  return td;
}

function updateFilter(){
  filter.playerName = document.getElementById('playerNameLookUp').value;
  let factions = document.getElementsByName('Faction');
  filter.factions = [];
  factions.forEach(faction=>{
    if(faction.checked){filter.factions.push(faction.value);}
  });
  let maps = document.getElementsByName('Map');
  filter.maps = [];
  maps.forEach(map=>{
    if(map.checked){filter.maps.push(map.value);}
  });
  let decks = document.getElementsByName('Deck');
  filter.decks = [];
  decks.forEach(deck=> {
    if (deck.checked) {filter.decks.push(deck.value);  }
  });
  filter.seasons = [];
  let seasons = document.getElementsByName('Season');
  seasons.forEach(season=> {
    if (season.checked) {filter.seasons.push(season.value);  }
  });
}
function updateStatsView(stats){
  document.getElementById('gamesWon').innerText = stats.player.gamesWon;
  document.getElementById('gamesPlayed').innerText = stats.player.gamesPlayed;
  document.getElementById('winRate').innerText = stats.player.winRate;
  document.getElementById('domSuccess').innerText = stats.player.domSuccess;
  document.getElementById('domAttempts').innerText = stats.player.domAttempts;
  document.getElementById('domSuccessRate').innerText = stats.player.domSuccessRate;
  document.getElementById('averageScore').innerText= stats.player.averageScore;
  document.getElementById('oppAverageScore').innerText = stats.opponents.averageScore;
  document.getElementById('oppDomAttempts').innerText = stats.opponents.domAttempts;
  document.getElementById('oppDomSuccess').innerText = stats.opponents.domSuccess;
  document.getElementById('oppDomSuccessRate').innerText = stats.opponents.domSuccessRate;
}

function doCalculatedStats(stats){
  let winRate =   stats.player.gamesWon / stats.player.gamesPlayed * 100;
  stats.player.winRate =    parseFloat(winRate).toFixed(2) + "%";
  let domRate = stats.player.domSuccess / stats.player.domAttempts * 100;
  stats.player.domSuccessRate = parseFloat(domRate).toFixed(2) + "%";
  stats.player.averageScore = parseFloat(stats.player.pointsScored /stats.player.gamesPlayed).toFixed(2);
  let oppWinRate =   stats.opponents.gamesWon / stats.opponents.gamesPlayed;
  stats.opponents.winRate =   parseFloat(oppWinRate).toFixed(2) + "%";
  let oppDomRate =  stats.opponents.domSuccess / stats.opponents.domAttempts * 100;
  stats.opponents.domSuccessRate = parseFloat(oppDomRate).toFixed(2) +"%"
  stats.opponents.averageScore = parseFloat(stats.opponents.pointsScored /stats.opponents.gamesPlayed).toFixed(2);


}

function loadPlayerGames(){
  let playerName = document.getElementById('playerNameLookUp').value;
  updateFilter();
  let tbody = document.getElementById('games');
  tbody.innerHTML = '';
  let stats = {
    'player': {
      'gamesPlayed': 0,
      'gamesWon': 0,
      'domAttempts': 0,
      'domSuccess': 0,
      'coalitionVictories': 0,
      'coalitionTargets': 0,
      'coalitionsFormed': 0,
      'pointsScored': 0
    },
    'opponents': {
      'gamesPlayed': 0,
      'gamesWon': 0,
      'domAttempts': 0,
      'domSuccess': 0,
      'coalitionVictories': 0,
      'coalitionTargets': 0,
      'coalitionsFormed': 0,
      'pointsScored': 0
    }
  }
  let idx = 1;
  allGames.forEach(game=>{
    if(gameMatchesFilter(game, filter)) {
      let tr = document.createElement('tr');
      tr.setAttribute('id', 'allDataRow-' + game.id);
      tr.append(createBasicTd(idx++));
      tr.append(createBasicTd(new Date(game.timeStamp).toLocaleDateString()));
      tr.append(createBasicTd(game.season));
      tr.append(createImg(mapImages[game['map']]));
      tr.append(createImg(deckImages[game.deck]));
      tr.append(createPlayerTd(game.player1, game));
      tr.append(createPlayerTd(game.player2, game));
      tr.append(createPlayerTd(game.player3, game));
      tr.append(createPlayerTd(game.player4, game));
      tbody.append(tr);
      let players = [game.player1, game.player2, game.player3, game.player4];
      let player = getPlayer(players, filter.playerName);
      let opponents = getOpponents(players, playerName);
      updatePlayerStats(game, player, stats.player);
      updateOpponentStats(game, opponents,  stats.opponents);
    }
  });
  doCalculatedStats(stats);
  updateStatsView(stats);
  console.log(stats);
}

function gameMatchesFilter(game, filter){
  let players = [game.player1, game.player2, game.player3, game.player4];
  let player = getPlayer(players, filter.playerName);
  if(filter.decks.includes(game.deck)
    && filter.maps.includes(game.map)
    && filter.seasons.includes(''+game.season)
    && filter.factions.includes(player.faction)){
    return true;
  }
  return false; //  filter game on deck/map/ player/ opponents
}

function updateOpponentStats(game, opponents, statBlock){
  for(let i = 0; i < opponents.length; i++){
    let opp = opponents[i];
    updatePlayerStats(game, opp, statBlock);
  }
}

function updatePlayerStats(game, player, statBlock){
  try
  {
    statBlock.gamesPlayed++;
    if (isNaN(player.score)) {
      let x = player.score.toLowerCase();
      if (x.includes('dom')) {
        statBlock.domAttempts = statBlock.domAttempts + 1;
        if (player.leagueScore > 0) {
          statBlock.domSuccess = statBlock.domSuccess + 1;
        }
      }
      if (x.includes('coal')) {
        statBlock.coalitionsFormed = statBlock.coalitionsFormed + 1;
        if (player.leagueScore > 0) {
          statBlock.coalitionVictories = statBlock.coalitionVictories + player.leagueScore;
        }
      }
    } else {
      statBlock.pointsScored = statBlock.pointsScored + player.score;
    }
    statBlock.gamesWon = statBlock.gamesWon + player.leagueScore;
  }
  catch(e){
    console.log('bad game? '+game);
  }
}

function getPlayer(players, playerName){
  let p;
  players.forEach(player=>{
    if(player.name === playerName){
      p= player;
    }
  });
  return p;
}
function getOpponents(players, playerName){
  let opponents = []
  players.forEach(player=>{
    if(player.name !== playerName){
      opponents.push(player);
    }
  });
  return opponents;
}
