const GOOG_SHEET_URL = "https://script.google.com/macros/s/AKfycbynrmAGhdlrQFhE3zpzlUuXwp5MX7FL-6mJz2Dz2WPMsjc2Ul3Vs8a3pwRj6GGeaYfDGA/exec";

function onFactionSelect(player){
   let tr = document.getElementById(player);
   let domLabel = tr.getElementsByClassName('domSelect')[0];
   if (isVagabond(player)){
      domLabel.textContent = 'Coalition';
   } else{
      domLabel.textContent = 'Dominance';
   }
   onDomSelect(player);
}

function onDomSelect(player){
  let tr = document.getElementById(player);
  let points = tr.getElementsByClassName('points')[0];
  let coalition = tr.getElementsByClassName('coalition')[0];
  let dominance = tr.getElementsByClassName('dom')[0];
  if(isDomSelected(player)){
    points.style.display = 'none';
    if(isVagabond(player)){
      dominance.style.display = 'none';
      coalition.style.display = 'inline';
    }else{
      coalition.style.display = 'none';
      dominance.style.display = 'inline';
    }
  }else{
    points.style.display = 'inline';
    coalition.style.display = 'none';
    dominance.style.display = 'none';
  }
}

function isCoalition(player){
  return isVagabond(player) && isDomSelected(player);
}

function isDomSelected(player){
  let tr = document.getElementById(player);
  return tr.getElementsByTagName('input')[1].checked;
}

function isVagabond(player){
 return getSelectedFaction(player).startsWith('Vagabond');
}

function getSelectedFaction(player){
  let tr = document.getElementById(player);
  return tr.getElementsByClassName("factionSelect")[0].value;
}

function getPlayerName(player){
  let tr = document.getElementById(player);
  return  tr.getElementsByTagName('input')[0].value;
}

function getPlayerDisplayName(player){
  let name =  getPlayerName(player)
  let tr = document.getElementById(player);
  name = name !== "" ? name : tr.getElementsByTagName('td')[0].innerText;
  return name;
}

/*******  Game form Validation methods **********************/
function validatePlayerNames(){
  validatePlayerName('player1');
  validatePlayerName('player2')
  validatePlayerName('player3')
  validatePlayerName('player4')
}

function validatePlayerName(id){
  if("" === getPlayerName(id)){
    addError(getPlayerDisplayName(id) + " needs a name!");
  }
}

function validatePlayerFactions(){
  let players = ['player1', 'player2', 'player3', 'player4'];
  for(let i = 0; i < players.length; i++){
    validatePlayerFaction(players[i], players, i+1);
  }
}

function validatePlayerFaction(id, players, idx){
  let faction = getSelectedFaction(id);
  if (faction === ""){
    addError(getPlayerDisplayName(id) + " needs a faction selection!");
  }else{
    if(idx < players.length){
      for(let i= idx; i < players.length; i++){
        let otherFaction = getSelectedFaction(players[i]);
        if(otherFaction === faction){
          addError(getPlayerDisplayName(id) + " and "+ getPlayerDisplayName(players[i]) + " cannot both have faction : "+ faction +"!");
        }
      }
    }
  }
}

function validateScores(){
  let score1 = document.getElementById("Player 1 Game Score");
  let score2 = document.getElementById("Player 2 Game Score");
  let score3 = document.getElementById("Player 3 Game Score");
  let score4 = document.getElementById("Player 4 Game Score");
  score1.value = calculatePlayerScore('player1')
  if(score1.value === ""){
    addError(getPlayerDisplayName('player1') + " needs a score!")
  }
  score2.value = calculatePlayerScore('player2');
  if(score2.value === ""){
    addError(getPlayerDisplayName('player2') + " needs a score!")
  }
  score3.value = calculatePlayerScore('player3');
  if(score3.value === ""){
    addError(getPlayerDisplayName('player3') + " needs a score!")
  }
  score4.value = calculatePlayerScore('player4')
  if(score4.value === ""){
    addError(getPlayerDisplayName('player4') + " needs a score!")
  }
  if(!isTourneyScoreValid()){
    addError("Make sure Tournament score adds up to 1.0 exactly.")
  }
}

function validateWinner(){
  //validate winner has (30 points and Tournament score 1) or (Dom and no other player with 30 points and tournament score 1) or
  // two players have tournament score 0.5 and one is a vagabond and the other is the coalition partner
}

function validateAndSubmit(){
  emptyAllErrors();
  validatePlayerNames();
  validatePlayerFactions();
  validateScores();
  validateWinner();
  if(isEmptyErrors()){
    document.getElementById('errors').style.display = 'none';
    document.getElementById("formSubmit").disabled = true;
    sendData();
  } else{
    document.getElementById('errors').style.display = 'block';
    return false;
  }
}

function emptyAllErrors(){
  document.getElementById('errors').innerHTML = "";
}

function addError(msg){
  let error = document.createElement('li');
  error.innerText = msg;
  document.getElementById('errors').append(error);
}

function isEmptyErrors(){
  return document.getElementById('errors').innerHTML === "";
}

function isTourneyScoreValid(){
  return 1 === findTourneyScore('player1')+findTourneyScore('player2')+findTourneyScore('player3')+findTourneyScore('player4');
}

function findTourneyScore(player){
  let tr = document.getElementById(player);
  return +tr.getElementsByTagName('select')[3].value;
}

function calculatePlayerScore(player){
  let tr = document.getElementById(player);
  let val;
  if(isDomSelected(player) && !isCoalition(player)){
    val = tr.getElementsByTagName('select')[1].value + " Dom";
  }else if(isDomSelected(player)){
    let span = tr.getElementsByClassName("coalition")[0];
    let partner = span.getElementsByTagName("select")[0].value;
    val = "Coalition w/" + getSelectedFaction(partner);
  }else{
    let  span = tr.getElementsByClassName("points")[0];
    val = span.getElementsByTagName("input")[0].value;
  }
  return val;
}
/****************************************************/
function showLeaderBoard(json){
  for(let i = 0; i < json.length; i++){
     let rank = json[i];
     console.log(rank);
  }
}

function suggestNames(json){
  alert(json.toString());
}

function getNamesLike(text){
  getData(suggestNames, {'fnc': 'suggest', 'text':text});
}

function getLeaderBoard(){
  getData(showLeaderBoard, {'fnc': 'leaderBoard'});
}

function formatParams( params ){
  return "?" + Object
    .keys(params)
    .map(function(key){
      return key+"="+encodeURIComponent(params[key])
    })
    .join("&")
}

function getData(callback, params){
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", (event)=>{
    var data = JSON.parse(event.target.responseText);
    callback(data);
  });
  xhr.addEventListener("err", (event)=>{
    alert("Error");
  });

  xhr.open("GET",GOOG_SHEET_URL+formatParams(params));
  xhr.send("null");
}

function sendData(){
  const fd = new FormData(document.getElementById('gameForm'));
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", (event)=>{
    alert("Game submitted");
    document.getElementById('gameForm').reset();
    document.getElementById('formSubmit').disabled = false;
  });
  xhr.addEventListener("err", (event)=>{
    alert("Error data not saved!");
    document.getElementById('formSubmit').disabled = false;
  })
  xhr.open("POST", GOOG_SHEET_URL );
  xhr.send(fd);
}

function toggleRules(){
  let rules = document.getElementById('rules');
  if(rules.style.display !== 'block'){
    rules.style.display = 'block';
  }else{
    rules.style.display = 'none';
  }
}

window.addEventListener("load", () => {
 let form = document.getElementById("gameForm");
 form.addEventListener("submit", (event) => {
  event.preventDefault();
  validateAndSubmit();
});
});
