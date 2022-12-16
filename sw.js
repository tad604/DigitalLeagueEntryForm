const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/css/main.css",
      "/css/normalize.css",
      "/js/main.js",
      "/img/vagrant.png",
      "/img/Medium_Box.png",
      "/img/root-background.jpg",
      "/img/autumn.jpg",
      "/img/baseDeck.gif",
      "/img/ExilesAndPartisansDeck.gif",
      "/img/winter.jpg"
    ])
  );
});
