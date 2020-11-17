console.log("Hi from service worker");

const indexHtmlFiles = [
  "/" /* index.html itself */,
  "manifest.webmanifest",
  "global.css",
  "favicon.png",
  "/build/bundle.js",
  "/build/bundle.css",
  "/icons/earfedicon-apple-touch.png",
];

// not caching the icons because they are on the home screen and therefore kind
// of cached already.
const manifestFiles = [
  "/icons/earfedicon-192.png",
  "/icons/earfedicon-512.png",
  "/icons/earfedicon-maskable-192.png",
  "/icons/earfedicon-maskable-512.png",
];

const appFiles = [...indexHtmlFiles, ...manifestFiles];

const appV1 = "app-v1";

self.addEventListener("install", (event) => {
  console.log("V1 installing…");
  event.waitUntil(
    caches.open(appV1).then((cache) => cache.addAll(indexHtmlFiles))
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  console.log(`fetch handler for ${url}`);
  if (event.request.destination === "audio") {
    console.log(
      "request from <audio>. No special handling in fetch event handler."
    );
    return;
  } else if (appFiles.some((af) => url.pathname.endsWith(af))) {
    console.log(`trying to serve from cache.`);
    event.respondWith(
      caches.open(appV1).then((cache) =>
        cache.match(event.request).then((response) => {
          console.log(
            response
              ? `in cache: ${event.request.url}`
              : `not in cache ${event.request.url}`
          );
          return response;
        })
      )
    );
    return;
  }
  event.respondWith(
    caches.open("metadata").then((cache) =>
      cache.match(event.request).then(
        (response) =>
          response ||
          fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
      )
    )
  );
});
