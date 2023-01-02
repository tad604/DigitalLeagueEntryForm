GOOGLE_SHEET_FETCH_LEADER_BOARDS = "https://script.google.com/macros/s/AKfycbxVhClTuGY6vIEThVLmefiMLZktE8CoUxkqgZ9lug7an7tl67qaRwVWdOVLinXWKw8YCg/exec";
let leaderBoardInfo = {};  // object derived from leaderBoards  where each leaderboard is mapped by name
let leaderBoards = [];  //array all leaderboards from call to spreadsheet
window.addEventListener("load", () => {
  refreshLeaderBoardData()
});

function updateSeasonsList(){

  let ul = document.getElementById('seasonsList');
  ul.innerHTML = '';
  leaderBoards.forEach(function(item, index){
    ul.appendChild(createSeasonLi(item, index));
  });
}

function createSeasonLi(season, index){
  let li = document.createElement('li');
  li.id = season.name;
  if(index == 0){
    li.classList.add('selected');
  }
  li.innerText =season.name;
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
  let players = leaderBoardData.leaders;
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
    if(leaderBoards.length !== 0){
      updateSeasonsList();
      updateLeaderBoard(leaderBoards[0]);
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
      leaderBoards = data;
      data.forEach(function(item, index){
        leaderBoardInfo[item.name] = item;
      })
      updateSeasonsList(data);
      updateLeaderBoard(data[0]); //first leaderboard is "all Seasons"
      showLoaded();
    }).catch (function(e){
      showFailedToLoad(e);
   });
}

