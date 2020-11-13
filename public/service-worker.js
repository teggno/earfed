console.log("Hi from service worker");

const appFiles = [
  "index.html",
  "manifest.webmanifest",
  "global.css",
  "favicon.png",
  "/build/bundle.js",
  "/build/bundle.css",
  "/icons/earfedicon-apple-touch.png",
  "/icons/earfedicon-192.png",
  "/icons/earfedicon-512.png",
  "/icons/earfedicon-maskable-192.png",
  "/icons/earfedicon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  //   console.log("V1 installing…");
  //   event.waitUntil(
  //     caches.open("app-v1").then((cache) => cache.addAll(appFiles))
  //   );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.destination === "audio") {
    console.log("request from <audio>. serving from network");
    return;
  } else if (appFiles.some((af) => url.pathname.endsWith(af))) {
    console.log("app file requested. serving from network");
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
