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
});
