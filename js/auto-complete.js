
const GOOGLE_SHEET_FETCH_ALL_PLAYER_NAMES ="https://script.google.com/macros/s/AKfycbzEGYYAGLI7azY4RKVclXiy_OoLQQA6wNuYb-tCQCGbEU8nU6qinYBAJ_XSepCjOETzMA/exec"; "https://script.google.com/macros/s/AKfycbxniMwiU7ca8IGDX_3VJRz4qo0Mc9vQ1MkQR7NvgYfbub673-XTJgrQgvU1FVMkH_KW/exec";
fetch(GOOGLE_SHEET_FETCH_ALL_PLAYER_NAMES).then((response)=> response.json()).then((data)=> {
  console.log(data);
  addAutoComplete(data);
});
function addAutoComplete(data) {
  ['#playerName1', '#playerName2', '#playerName3', '#playerName4', '#playerNameLookUp', '#opponentLookUp1', '#opponentLookUp2', '#opponentLookUp3'].forEach(function(name){
    new autoComplete({
      selector: name,
      minChars: 1,
      source: mySuggest
    });
  });
  function mySuggest(term, suggest) {
    term = term.toLowerCase();
    let choices = data;
    let matches = [];
    for (let i = 0; i < choices.length; i++) {
      if (choices[i].toLowerCase().startsWith(term)) {
        matches.push(choices[i]);
      }
    }
    //if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
    suggest(matches);
  }
}
