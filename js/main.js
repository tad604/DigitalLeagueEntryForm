function updateFaction(player, control){
   let tr = document.getElementById(player);
   let domLabel = tr.getElementsByClassName('domSelect')[0];
   let faction = control.value;
   let isVagabond = faction.startsWith('Vagabond');

   if (isVagabond){
      domLabel.textContent = 'Coalition';
   } else{
      domLabel.textContent = 'Dominance';
   }
}

function selectDom(player, control){
  let tr = document.getElementById(player);
  let faction = tr.getElementsByClassName("factionSelect")[0].value;
  let isVagabond = faction.startsWith('Vagabond');
  let isDom = control.checked;
  let points = tr.getElementsByClassName('points')[0];
  let coalition = tr.getElementsByClassName('coalition')[0];
  let dominance = tr.getElementsByClassName('dom')[0];
  if(isDom){
    points.style.display = 'none';
    if(isVagabond){
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

function calculateScores(){
  let score1 = document.getElementById("Player 1 Game Score");
  let score2 = document.getElementById("Player 2 Game Score");
  let score3 = document.getElementById("Player 3 Game Score");
  let score4 = document.getElementById("Player 4 Game Score");

  score1.value = findScore('player1');
  score2.value = findScore('player2');
  score3.value = findScore('player3');
  score4.value = findScore('player4')

  document.getElementById('gameForm').submit();

}

function findFactionOfPlayer(player){
  let tr = document.getElementById(player);
  let faction = tr.getElementsByClassName("factionSelect")[0].value;
  return faction;
}

function findScore(playerRow){
  let tr = document.getElementById(playerRow);
  let faction = tr.getElementsByClassName("factionSelect")[0].value
  let isVagabond = faction.startsWith('Vagabond');
  let isDom = tr.getElementsByTagName('input')[1].checked;
  let isCoalition = isVagabond && isDom;
  let val;
  if(isDom && !isCoalition){
   let span = tr.getElementsByClassName("dom")[0];
   val = tr.getElementsByTagName('select')[1].value + " Dom";
  }else if(isDom){
    let span = tr.getElementsByClassName("coalition")[0];
    let partner = span.getElementsByTagName("select")[0].value;
    val = "Coalition w/" + findFactionOfPlayer(partner);
  }else{
    let  span = tr.getElementsByClassName("points")[0];
    val = span.getElementsByTagName("input")[0].value;
  }
  return val;
}
