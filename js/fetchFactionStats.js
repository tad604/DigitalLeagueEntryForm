GOOGLE_SHEET_FETCH_FACTION_STATS ="https://script.google.com/macros/s/AKfycbx6wu-N0oNQ8cqILVkz5gh4jNlNFc2UyvbLDVCrBwiG-FTyzTXTr6AZMUAD9B9tr5ND/exec";
GOOGLE_SHEET_FETCH_PLAYER_STATS = "https://script.google.com/macros/s/AKfycbxUCOxxoGV8Uv4Pd5GWA8oyXXhmBpXBFQTrdB6x-ZgEQrvro4IO-zot6YSGlDhlIC-Urw/exec";
let factionStats = {};
window.addEventListener("load", () => {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const playerName = urlParams.get('playerName');
  document.getElementById('playerNameLookUp').value = playerName;
  refreshFactionStats();
});

function updateSeasonsList(data){
  let seasons =[];
  for(const key in data){
    if(key !== 'allTime'){
      seasons.push(key);
    }
  }
  seasons.reverse();
  let ul = document.getElementById('seasonsList');
  ul.innerHTML = '';
  ul.appendChild(createSeasonLi('allTime', data, true))
  for(let i = 0; i < seasons.length; i++){
    ul.appendChild(createSeasonLi(seasons[i], data));
  }
}

function createSeasonLi(season, data, isDefault){
  let li = document.createElement('li');
  li.id = season;
  if(isDefault){
    li.classList.add('selected');
  }
  li.innerText =data[season]['name'];
  li.addEventListener('click', selectSeason);
  return li;
}

function selectSeason(event){
  let selectedSeason = event.target;
  let unselect = document.querySelectorAll('li.selected');
  for(let i = 0; i < unselect.length; i++){
    unselect[i].classList.remove('selected');
  }
  selectedSeason.classList.add('selected');
  updateFactionsStats(factionStats[selectedSeason.id]);
}

function updateFactionsStats(factionStatData) {
  let leaderBoardTitle = document.getElementById('factionStatsTitle');
  leaderBoardTitle.innerText = factionStatData.name + " Faction Stats";
  let tbody = document.getElementById('factions');
  tbody.innerHTML = '';
  let factions = factionStatData.factions;
  document.querySelectorAll('th')[0].click(); //comes in sorted first click doesn't do anything
  for (let i = 0; i < factions.length; i++) {
    let tr = createFactionRow(factions[i]);
    tbody.appendChild(tr);
  }
  document.querySelectorAll('th').forEach(th => th.classList.remove('sortDesc', 'sortAsc'));
  document.querySelectorAll('th')[0].classList.add('sortAsc');
}

function updatePlayerStats(playerStatsData){
  let leaderBoardTitle = document.getElementById('factionStatsTitle');
  leaderBoardTitle.innerText =  playerStatsData.name + " Faction Stats";
  let tbody = document.getElementById('factions');
  tbody.innerHTML = '';
  let factions = playerStatsData.factions;
  document.querySelectorAll('th')[0].click(); //comes in sorted first click doesn't do anything
  for (let i = 0; i < factions.length; i++) {
    let tr = createFactionRow(factions[i]);
    tbody.appendChild(tr);
  }
  document.querySelectorAll('th').forEach(th => th.classList.remove('sortDesc', 'sortAsc'));
  document.querySelectorAll('th')[0].classList.add('sortAsc');
}

function createFactionRow(faction){
  let tr = document.createElement('tr');
  for(const key in faction){
    let td = document.createElement('td');
    td.innerText = (key === "winRate") ? formatWinRate(faction[key]) : faction[key];
    if(key === 'order'){
      td.style.display = 'none';
    }
    tr.appendChild(td);
  }
  return tr;
}

function formatWinRate(winRate){
  return parseFloat(winRate).toFixed(2) + "%";
}

function showLoading(){
  let dummyUl = document.getElementById('dummy-list');
  dummyUl.style.display = 'block';
  let dummyTbody = document.getElementById('dummy-tbody');
  dummyTbody.hidden = false;
  let tbody = document.getElementById('factions');
  tbody.hidden = true;
  let otherStats = document.getElementById('otherStats');
  otherStats.hidden = true;
  let ul = document.getElementById('seasonsList');
  ul.style.display = 'none';
}

function showLoaded(){
  let dummyUl = document.getElementById('dummy-list');
  dummyUl.style.display = 'none';
  let dummyTbody = document.getElementById('dummy-tbody');
  dummyTbody.hidden = true;
  let tbody = document.getElementById('factions');
  tbody.hidden = false;
  let otherStats = document.getElementById('otherStats');
  otherStats.hidden = false;
  let ul = document.getElementById('seasonsList');
  ul.style.display = 'block';
}
function showNoResultsToLoad(){
  let ul = document.getElementById('seasonsList');
  ul.innerHTML = 'No Results found!!!';
  let tbody = document.getElementById('factions');
  tbody.innerHTML = 'No Results found!!!';
  showLoaded();
}
function showFailedToLoad(e){
  if(confirm("Failed to retrieve faction stats!!  Try again?")){
    refreshFactionStats();
  }else{
    if(Object.keys(factionStats).length !== 0){
      updateSeasonsList(factionStats);
      updateFactionsStats(factionStats);
      showLoaded();
    }else{
      showNoResultsToLoad();
    }
  }
}

function updatePlayerOtherStats(data){
  // add win rates by turn order,  and win by coalition/Dominance.
  let unselect = document.querySelectorAll('li.selected');
  for(let i = 0; i < unselect.length; i++){
    unselect[i].classList.remove('selected');
  }
  document.getElementById('staticList').getElementsByTagName('li')[0].classList.add('selected');

}

function loadPlayerStats(){
  let playerName = document.getElementById('playerNameLookUp').value;
  showLoading();
  fetch(GOOGLE_SHEET_FETCH_PLAYER_STATS+"?name="+encodeURIComponent(playerName)).then((response)=> response.json()).then((data)=> {
    console.log(data);
    updateFactionsStats(data);
    updatePlayerOtherStats(data)
    showLoaded();
  }).catch(function(e){
    showFailedToLoad(e);
  });
}

function refreshFactionStats(){
  showLoading()
  let playerName = document.getElementById('playerNameLookUp');
  fetch(GOOGLE_SHEET_FETCH_FACTION_STATS).then((response)=> response.json()).then((data)=> {
    console.log(data);
    factionStats = data;
    updateSeasonsList(data);
    if(playerName.value){
      loadPlayerStats();
    }else{
      updateFactionsStats(data['allTime']);
      showLoaded();
    }

  }).catch (function(e){
    showFailedToLoad(e);
  });
}

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
  const tbody = document.getElementById('factions');
  document.querySelectorAll('th').forEach(th => th.classList.remove('sortDesc', 'sortAsc'));
  if(this.asc){
    th.classList.remove('sortAsc');
    th.classList.add('sortDesc');
  }else{
    th.classList.add('sortAsc');
    th.classList.remove('sortDesc');
  }
  Array.from(tbody.getElementsByTagName('tr'))
    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
    .forEach(tr => tbody.appendChild(tr) );
})));
