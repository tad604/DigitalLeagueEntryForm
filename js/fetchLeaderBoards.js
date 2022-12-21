GOOGLE_SHEET_FETCH_LEADER_BOARDS = "https://script.google.com/macros/s/AKfycbzuMpS5Ec7Q4icnUNkp_IXjRsXOPzJZQjFU9YKi1He-oIJv0Ut3Zq0el2kOduTN0DTM/exec";
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
    td.innerText = player[key];
    tr.appendChild(td);
  }
  return tr;
}

function refreshLeaderBoardData(){
  fetch(GOOGLE_SHEET_FETCH_LEADER_BOARDS).then((response)=> response.json()).then((data)=> {
    console.log(data);
    leaderBoardInfo = data;
    updateSeasonsList(data);
    updateLeaderBoard(data['allTime']);
    });
}
