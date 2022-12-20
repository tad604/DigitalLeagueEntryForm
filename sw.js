const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};
const GOOGLE_SHEET_FETCH_ALL_PLAYER_NAMES = "https://script.google.com/macros/s/AKfycbxniMwiU7ca8IGDX_3VJRz4qo0Mc9vQ1MkQR7NvgYfbub673-XTJgrQgvU1FVMkH_KW/exec";

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "index.html",
      "css/main.css",
      "css/normalize.css",
      "js/main.js",
      "fonts/Luminari-Regular.woff",
      "fonts/Baskerville10Pro.woff",
      "img/vagrant.png",
      "img/vagrant-lg.png",
      "img/Medium_Box.png",
      "img/root-background.jpg",
      "img/autumn.jpg",
      "img/baseDeck.gif",
      "img/ExilesAndPartisansDeck.gif",
      "img/winter.jpg"
    ])
  );
  self.fetch(GOOGLE_SHEET_FETCH_ALL_PLAYER_NAMES).then((response)=> response.json()).then((data)=>{
    console.log(data);
    let openRequest = indexedDB.open("players", 3);
    openRequest.onupgradeneeded = (event) =>{
            //initialization/updating
      const db = event.target.result;
      if(!db.objectStoreNames.contains('playerNames')){
        db.createObjectStore("playerNames");
      }
    }
    openRequest.onerror = function (){
      console.error("Error", openRequest.onerror);
    }
    openRequest.onsuccess = function(){
      let db = openRequest.result;
      let tx = db.transaction("playerNames","readwrite");
      let playerNames = tx.objectStore("playerNames");
      let namesUpdate =  playerNames.put(data, "playerNames");
      namesUpdate.onsuccess = function (event){
        console.log("player names stored.." + event);
      }
    }
  });
});
