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
  return tr.getElementsByTagName('input')[0].value;
}

function calculateScores(){
  emptyAllErrors();
  let score1 = document.getElementById("Player 1 Game Score");
  let score2 = document.getElementById("Player 2 Game Score");
  let score3 = document.getElementById("Player 3 Game Score");
  let score4 = document.getElementById("Player 4 Game Score");
  score1.value = calculatePlayerScore('player1')
  if(score1.value === ""){
    addError(getPlayerName('player1') + " needs a score!")
  }
  score2.value = calculatePlayerScore('player2');
  if(score2.value === ""){
    addError(getPlayerName('player2') + " needs a score!")
  }
  score3.value = calculatePlayerScore('player3');
  if(score3.value === ""){
    addError(getPlayerName('player3') + " needs a score!")
  }
  score4.value = calculatePlayerScore('player4')
  if(score4.value === ""){
    addError(getPlayerName('player4') + " needs a score!")
  }
  if(!isTourneyScoreValid()){
    addError("Make sure Tournament score adds up to 1.0 exactly.")
  }
  if(isEmptyErrors()){
    document.getElementById('gameForm').submit();
  } else{
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
  let val ="";
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
