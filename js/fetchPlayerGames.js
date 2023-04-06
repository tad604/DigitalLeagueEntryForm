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
  'Lake':'lake.png',
  'Mountain':'mountain.png',
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

function createLinkToSpreadsheet(count, row){
 let td = document.createElement('td');
 let url = 'https://docs.google.com/spreadsheets/d/1xqb3vdvE5tbbVfa1eUFvx5uYIO52pePNLfOA3NYR2eE/edit#gid=1595954131&range='+row+":"+row;
 let link = document.createElement('a');
 link.href = url;
 link.target = '_blank';
 link.innerText = count;
 td.append(link);
 return td;
}

function createImg(content, clazz){
  let img = document.createElement('img');
  img.src = "img/"+content;
  img.alt = content;
  img.classList.add(clazz);
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

function removeOpponent(idx){
  document.getElementById('opponentLookUp'+idx).value = '';
  delete filter['opponentName'+idx];
  loadPlayerGames();
}

function addOpponent(idx){
  filter['opponentName'+idx] = document.getElementById('opponentLookUp'+idx).value;
  loadPlayerGames();
}


function clickAll(group){
  let opts = document.getElementsByName(group);


}
function updateFilter(){
  filter.playerName = document.getElementById('playerNameLookUp').value;
  let turnOrders = document.getElementsByName('TurnOrder');
  filter.turnOrders = [];
  turnOrders.forEach(turnOrder=>{
    if(turnOrder.checked){filter.turnOrders.push(turnOrder.value);}
  });
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
  filter.victory = [];
  let victory = document.getElementsByName('Victory');
  victory.forEach(cnd=> {
    if (cnd.checked) {filter.victory.push(cnd.value);  }
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

  for(let i = 1; i < 4; i++){
    if(stats['opponent'+1]) {
      document.getElementById('opponent' + i + 'GamesWon').innerText = stats['opponent' + i].gamesWon;
      document.getElementById('opponent' + i + 'WinRate').innerText = stats['opponent' + i].winRate;
      document.getElementById('opponent' + i + 'DomSuccess').innerText = stats['opponent' + i].domSuccess;
      document.getElementById('opponent' + i + 'DomAttempts').innerText = stats['opponent' + i].domAttempts;
      document.getElementById('opponent' + i + 'DomSuccessRate').innerText = stats['opponent' + i].domSuccessRate;
      document.getElementById('opponent' + i + 'AverageScore').innerText = stats['opponent' + i].averageScore;
    }
  }

}

function doCalculatedStats(stats){
  let winRate =   stats.player.gamesWon / stats.player.gamesPlayed * 100;
  stats.player.winRate =    parseFloat(winRate).toFixed(2) + "%";
  let domRate = stats.player.domSuccess / stats.player.domAttempts * 100;
  stats.player.domSuccessRate = parseFloat(domRate).toFixed(2) + "%";
  stats.player.averageScore = parseFloat(stats.player.pointsScored /stats.player.gamesPlayed).toFixed(2);

  for(let i = 1; i < 4; i++){
    if(stats['opponent'+1]) {
      let wr = stats['opponent' + i].gamesWon / stats['opponent' + i].gamesPlayed * 100;
      stats['opponent' + i].winRate = parseFloat(wr).toFixed(2) + "%";
      let dr = stats['opponent' + i].domSuccess / stats['opponent' + i].domAttempts * 100;
      stats['opponent' + i].domSuccessRate = parseFloat(dr).toFixed(2) + "%";
      stats['opponent' + i].averageScore = parseFloat(stats['opponent' + i].pointsScored / stats['opponent' + i].gamesPlayed).toFixed(2);
    }
  }


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
    'opponent1': {
      'gamesPlayed': 0,
      'gamesWon': 0,
      'domAttempts': 0,
      'domSuccess': 0,
      'coalitionVictories': 0,
      'coalitionTargets': 0,
      'coalitionsFormed': 0,
      'pointsScored': 0
    },
    'opponent2': {
      'gamesPlayed': 0,
      'gamesWon': 0,
      'domAttempts': 0,
      'domSuccess': 0,
      'coalitionVictories': 0,
      'coalitionTargets': 0,
      'coalitionsFormed': 0,
      'pointsScored': 0
    },
    'opponent3': {
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
      tr.append(createLinkToSpreadsheet(idx++, game.id));
      tr.append(createBasicTd(new Date(game.timeStamp).toLocaleDateString()));
      tr.append(createBasicTd(game.season));
      tr.append(createImg(mapImages[game['map']], 'map'));
      tr.append(createImg(deckImages[game.deck]));
      tr.append(createPlayerTd(game.player1, game));
      tr.append(createPlayerTd(game.player2, game));
      tr.append(createPlayerTd(game.player3, game));
      tr.append(createPlayerTd(game.player4, game));
      tbody.append(tr);
      let players = [game.player1, game.player2, game.player3, game.player4];
      let player = getPlayer(players, filter.playerName);
      updatePlayerStats(game, player, stats.player);
      let opponent1 = getPlayer(players, filter['opponentName1']);
      updatePlayerStats(game, opponent1,  stats.opponent1);
      let opponent2 = getPlayer(players, filter['opponentName2']);
      updatePlayerStats(game, opponent2,  stats.opponent2);
      let opponent3 = getPlayer(players, filter['opponentName3']);
      updatePlayerStats(game, opponent3,  stats.opponent3);
    }
  });
  doCalculatedStats(stats);
  updateStatsView(stats);
  console.log(stats);
}
function isDom(suit, score){
  return isNaN(score) && score.toLowerCase().includes(suit);
}
function isCoalitioned(player, players){
  let isCoal = false;
  if( isNaN(player.score) && player.score.toLowerCase().includes('coal')){
    isCoal = true;
  }else{
    players.forEach(p=>{
      if(isNaN(p.score) && p.score.toLowerCase().includes(player.faction.toLowerCase())){
        isCoal = true;
      }
    });
  }
  return isCoal;
}

function meetsVictoryConditions(player, players, conditions){
  let isCoal = isCoalitioned(player, players);
  if(!conditions.includes('win') && (player.leagueScore > 0)){
    return false;
  }else if(!conditions.includes('loss') && player.leagueScore === 0){
    return false;
  }else if(!conditions.includes('Points') && !isNaN(player.score)){
    return false;
  }else if(!conditions.includes('mouse')  && (isDom('mouse', player.score) || isDom('mice', player.score) )){
    return false;
  }else if(!conditions.includes('fox')  && isDom('fox', player.score)) {
    return false;
  }else if(!conditions.includes('bunny')  && (isDom('bunny', player.score) || isDom('rabbit', player.score))) {
    return false;
  }else if(!conditions.includes('bird')  && isDom('bird', player.score)) {
    return false;
  }else if(!conditions.includes('coalitioned') && isCoal){
     return false;
  }else if(!conditions.includes('notCoalitioned') && !isCoal) {
     return false;
  }
  return true;
}

function gameMatchesFilter(game, filter){
  try {
    let players = [game.player1, game.player2, game.player3, game.player4];
    let player = getPlayer(players, filter.playerName);
    let opponents = getOpponents(players, filter.playerName);
    let opponentNames = [];
    opponents.forEach(op =>{
      opponentNames.push(op.name);
    });
    if (filter.decks.includes(game.deck)
      && (filter.maps.length == 2 || filter.maps.includes(game.map))
      && filter.seasons.includes('' + game.season)
      && filter.factions.includes(player.faction)
      && (filter.turnOrders.length == 4 || filter.turnOrders.includes('' + player.turnOrder))
      && meetsVictoryConditions(player, players, filter.victory)
      && (filter.opponentName1 === undefined || filter.opponentName1 === '' || opponentNames.includes(filter.opponentName1))
      && (filter.opponentName2 === undefined || filter.opponentName2 === '' || opponentNames.includes(filter.opponentName2))
      && (filter.opponentName3 === undefined || filter.opponentName3 === '' || opponentNames.includes(filter.opponentName3))
    ) {
      return true;
    }
  }catch(e){
    console.log(e + " error with game: "+ game.id + " -" + JSON.stringify(game));
  }
  return false; //  filter game on deck/map/ player/ opponents
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
  players.forEach((player, idx)=>{
    if(player.name === playerName){
      p = player;
      p.turnOrder = idx+1;
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
