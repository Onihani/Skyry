const cacheName = "weather-cache";
const staticAssets = [
  "./",
  "./index.html",
  "./css/main.css",
  "./css/util.css",
  "./index.js",
  "./weatherApi.js",
  "./renderComponents.js",
  "./manifest.json",
  "./font/Baloo2-Regular.ttf",
  // bootstrap
  "./scripts/bootstrap.min.js",
  "./scripts/jquery.min.js",
  "./scripts/propper.min.js",
  // all other static components here
  "./components/alertModal.js",
  "./components/current-weather-card.js",
  "./components/weekly-weather-card.js",
  // images
  "./images/weather/cool-bg.jpg"
];

self.addEventListener("install", async (event) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
