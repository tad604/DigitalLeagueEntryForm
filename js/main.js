const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxN-BfGk_NrEaKMNC3cWlISDyw4wqRkb-VsYRDZ3zd2U5E_eaTEbvxzdK5wY1jvPNVC/exec";
const players = ['player1', 'player2', 'player3', 'player4'];

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("sw.js");
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
      coalition.getElementsByTagName('select').value= null;
      dominance.style.display = 'inline';
      dominance.getElementsByTagName("select").value = null
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

function getDomSelection(player){
  let tr = document.getElementById(player);
  let val;
  if(isDomSelected(player) && !isVagabond(player)) {
    val = tr.getElementsByTagName('select')[1].value + " Dom";
  }
  return val;
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
  let partners = []
  for(let i = 0; i < players.length; i++){
    if(player !== players[i] && isVagabond(players[i]) && isDomSelected(players[i])){
      let vagPartner = findPartnerId(players[i]);
      if(vagPartner === player){
        partners.push(players[i]);
      }
    }
  }
  return partners;
}

function findPartnerId(player){
  if(isVagabond(player) && isDomSelected(player)) {
    let tr = document.getElementById(player);
    let span = tr.getElementsByClassName("coalition")[0];
    return span.getElementsByTagName("select")[0].value;
  }else{
    return findCoalitionPartnerVagabond(player)[0];
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
  let points = findPoints(id);
  let score = calculatePlayerScore(id);
  let tourneyScore = findTourneyScore(id);
  let isDom = isDomSelected(id);
  if(score === ""){
    addError(getPlayerDisplayName(id) + " needs a score!");
  }
  if(isDom){
     players.forEach((playerId)=>{
       if(playerId !== id && isDomSelected(playerId) && getDomSelection(playerId) === getDomSelection(id) ){
         addError(getPlayerDisplayName(id) + " and "+ getPlayerDisplayName(playerId) + " cannot have the same Dominance Suit Selected!" );
       }
     })
  }
  if(isPlayerInCoalition(id) && isVagabond(id) ){
    let partnerId = findPartnerId(id);
    if(isDom && isVagabond(partnerId)){
      if(id === findPartnerId(partnerId) && isDomSelected(partnerId)){
        addError(getPlayerDisplayName(id) + " and "+ getPlayerDisplayName(partnerId) + " cannot both target the other as coalition partner!");
      } else {
        if(isDomSelected(partnerId)){
          let anotherPartner = findPartnerId(partnerId);
          addError(" illegal three way coalition between " + getPlayerDisplayName(id) + ", " + getPlayerName(partnerId)+",  and "+getPlayerName(anotherPartner)+"!!!");
        }
      }
    }
  } else if(isPlayerInCoalition(id) && !isVagabond(id) && findCoalitionPartnerVagabond(id).length > 1) {
    addError(getPlayerDisplayName(id) + "  can not be the partner in two coalitions!");
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
    } else if( 0.5 !==   findTourneyScore(findPartnerId(id))){
      addError(getPlayerDisplayName(id) + " and " + getPlayerDisplayName(findPartnerId(id)) + " both need to have the same League Score!");
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
    document.getElementById("Player 1 Game Score").value = calculatePlayerScore(players[0]);
    document.getElementById("Player 2 Game Score").value = calculatePlayerScore(players[1]);
    document.getElementById("Player 3 Game Score").value = calculatePlayerScore(players[2]);
    document.getElementById("Player 4 Game Score").value = calculatePlayerScore(players[3]);
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

function findPoints(player){
  let tr = document.getElementById(player);
  let  span = tr.getElementsByClassName("points")[0];
  return span.getElementsByTagName("input")[0].value;
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
    val = findPoints(player);
  }
  return val;
}
/****************************************************/
function sendData(){
  const fd = new FormData(document.getElementById('gameForm'));
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", (event)=>{
    alert("Game submitted");
    console.log(event);
    document.getElementById('gameForm').reset();
    players.forEach(function(player){
      onDomSelect(player);
      onFactionSelect(player);
    });
    document.getElementById('formSubmit').disabled = false;
  });
  xhr.addEventListener("err", (event)=>{
    alert("Error data not saved!" + event);
    document.getElementById('formSubmit').disabled = false;
  })
  xhr.open("POST", GOOGLE_SHEET_URL );
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
