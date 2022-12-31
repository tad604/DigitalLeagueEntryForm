GOOGLE_SHEET_FETCH_LEADER_BOARDS = "https://script.google.com/macros/s/AKfycbwM0OyE-0B1dNVBAisfS8PK0WaC0h5dz2w60-j2hC4xK4_8_zRDOIxoWJHDqM2RAYMwHg/exec";
let leaderBoardInfo = {};
window.addEventListener("load", () => {
  refreshLeaderBoardData()
});

function updateSeasonsList(data){
  let seasons =[];
  for(const key in data){
    if(key !== 'allTime'){
      seasons.push(key);
    }
  }
  let ul = document.getElementById('seasonsList');
  ul.innerHTML = '';
  ul.appendChild(createSeasonLi('allTime', data, true))
  seasons = seasons.reverse();
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
  let seasons = selectedSeason.parentElement.getElementsByTagName('li');
  for(let i = 0; i < seasons.length; i++){
    seasons[i].classList.remove('selected');
  }
  selectedSeason.classList.add('selected');
  updateLeaderBoard(leaderBoardInfo[selectedSeason.id]);
}

function updateLeaderBoard(leaderBoardData) {
  let leaderBoardTitle = document.getElementById('leaderBoardTitle');
  leaderBoardTitle.innerText = leaderBoardData.name + " Leader Board";
  let tbody = document.getElementById('leaguePlayers');
  tbody.innerHTML = '';
  let players = leaderBoardData.players;
  for (let i = 0; i < players.length; i++) {
    let tr = createRankRow(players[i]);
    tbody.appendChild(tr);
  }
}

function createRankRow(player){
  let tr = document.createElement('tr');
  for(const key in player){
    let td = document.createElement('td');
    td.innerText = (key === "winRate") ?formatWinRate(player[key]) : player[key];
    tr.appendChild(td);
  }
  tr.onclick = function (){
    window.location = "/DigitalLeagueEntryForm/FactionStats.html?playerName="+ encodeURIComponent(player.player);
  }
  return tr;
}

function formatWinRate(winRate){
  return parseFloat(winRate).toFixed(2) + "%";
 // return Math.round((winRate + Number.EPSILON) * 100) / 100 +"%";
}

function showLoading(){
  let dummyUl = document.getElementById('dummy-list');
  dummyUl.style.display = 'block';
  let dummyTbody = document.getElementById('dummy-tbody');
  dummyTbody.hidden = false;
  let tbody = document.getElementById('leaguePlayers');
  tbody.hidden = true;
  let ul = document.getElementById('seasonsList');
  ul.style.display = 'none';
}

function showLoaded(){
  let dummyUl = document.getElementById('dummy-list');
  dummyUl.style.display = 'none';
  let dummyTbody = document.getElementById('dummy-tbody');
  dummyTbody.hidden = true;
  let tbody = document.getElementById('leaguePlayers');
  tbody.hidden = false;
  let ul = document.getElementById('seasonsList');
  ul.style.display = 'block';
}
function showNoResultsToLoad(){
  let ul = document.getElementById('seasonsList');
  ul.innerHTML = 'No Results found!!!';
  let tbody = document.getElementById('leaguePlayers');
  tbody.innerHTML = 'No Results found!!!';
  showLoaded();
}
function showFailedToLoad(e){
  if(confirm("Failed to retrieve leader board info!!  Try again?")){
    refreshLeaderBoardData();
  }else{
    if(Object.keys(leaderBoardInfo).length !== 0){
      updateSeasonsList(leaderBoardInfo);
      updateLeaderBoard(leaderBoardInfo);
      showLoaded();
    }else{
      showNoResultsToLoad();
    }
  }
}


function refreshLeaderBoardData(){
   showLoading()
   fetch(GOOGLE_SHEET_FETCH_LEADER_BOARDS).then((response)=> response.json()).then((data)=> {
      console.log(data);
      leaderBoardInfo = data;
      updateSeasonsList(data);
      updateLeaderBoard(data['allTime']);
      showLoaded();
    }).catch (function(e){
      showFailedToLoad(e);
   });
}

