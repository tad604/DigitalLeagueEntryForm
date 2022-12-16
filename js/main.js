const GOOG_SHEET_URL = "https://script.google.com/macros/s/AKfycbwUDIC8rxqWbsM9Jjx2rvh3sFqs_Dme7Jmk4IbjrXc69U9gs88ZpxhFbmUUD5DzbnHr/exec";
const players = ['player1', 'player2', 'player3', 'player4'];

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/js/sw.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

// …

registerServiceWorker();



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

/*************************/
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

function isPlayerInCoalition(player){
  return findPartnerId(player)
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

function findCoalitionPartnerVagabond(player){
  for(let i = 0; i < players.length; i++){
    if(player !== players[i] && isVagabond(players[i]) && isDomSelected(players[i])){
      let vagPartner = findPartnerId(players[i], true, true);
      if(vagPartner === player){
        return players[i];
      }
    }
  }
  return false;
}

function findPartnerId(player){
  if(isVagabond(player) && isDomSelected(player)) {
    let tr = document.getElementById(player);
    let span = tr.getElementsByClassName("coalition")[0];
    return span.getElementsByTagName("select")[0].value;
  }else{
    return findCoalitionPartnerVagabond(player);
  }
}

/*******  Game form Validation methods **********************/
function validatePlayerName(id){
  if("" === getPlayerName(id)){
    addError(getPlayerDisplayName(id) + " needs a name!");
  }
}
function validatePlayerFaction(id,  idx){
  let faction = getSelectedFaction(id);
  if (faction === ""){
    addError(getPlayerDisplayName(id) + " needs a faction selection!");
  }else{
    if(idx+1 < players.length){
      for(let i= idx+1; i < players.length; i++){
        let otherFaction = getSelectedFaction(players[i]);
        if(otherFaction === faction){
          addError(getPlayerDisplayName(id) + " and "+ getPlayerDisplayName(players[i]) + " cannot both have faction : "+ faction +"!");
        }
      }
    }
  }
}

function validatePlayerScore(id){
  let points = document.getElementById(id);
  let score = calculatePlayerScore(id);
  let tourneyScore = findTourneyScore(id);
  let isDom = isDomSelected(id);
  if(score.value == ""){
    addError(getPlayerDisplayName(id) + " needs a score!");
  }
  if(isPlayerInCoalition(id) && isVagabond(id) ){
    let partnerId = findPartnerId(id);
    if(isDomSelected(partnerId) && isVagabond(partnerId)){
      if(id === findPartnerId(partnerId)){
        addError(getPlayerDisplayName(id) + " and "+ getPlayerDisplayName(partnerId) + " cannot both target the other as coalition partner!");
      } else {
        if(isDomSelected(partnerId)){
          let anotherPartner = findPartnerId(partnerId);
          addError(" illegal three way coalition between " + getPlayerDisplayName(id) + ", " + getPlayerName(partnerId)+",  and "+getPlayerName(anotherPartner)+"!!!");
        }
      }
    }
  }
  if(tourneyScore === 1.0){
     if(score < 30 && ! isDom) {
       addError(getPlayerDisplayName(id) + " must have at least 30 points or successful Dominance! or adjust their League Score.");
     } else {
       if(isPlayerInCoalition(id)){
         addError(getPlayerDisplayName(id) + " should either have 0.5 League Score or not be part of a coalition!");
       }
     }
  } else if(tourneyScore === 0.5) {
    if (!isPlayerInCoalition(id)) {
      addError(getPlayerDisplayName(+" must be in a coalition to have this League Score! adjust score or input coalition information."));
    } else if (score < 30 && !isDom) {
      addError(getPlayerDisplayName(id) + " must have 30 or more points or be in coalition!  adjust score or input coalition information.");
    }
  } else {
      if (points > 29) {
        addError(getPlayerDisplayName(id) + " score is too high! or their League Score is too low!");
      }
  }
}

function validateLeagueScore(){
  if(1 !== findTourneyScore('player1')+findTourneyScore('player2')+findTourneyScore('player3')+findTourneyScore('player4')){
    addError("Make sure League score adds up to 1.0 exactly.")
  }
}

function validateAndSubmit(){
  emptyAllErrors();
  players.forEach(validatePlayerName);
  players.forEach(validatePlayerFaction);
  players.forEach(validatePlayerScore);
  validateLeagueScore();
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
    let partner = findPartnerId(player);
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
    players.forEach(function(player){
      onDomSelect(player);
      onFactionSelect(player);
    });
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
