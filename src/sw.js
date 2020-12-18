import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { setDefaultHandler } from "workbox-routing";
import {
  CacheFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from "workbox-strategies";
self.__WB_DISABLE_DEV_LOGS = true;
// self.addEventListener("fetch", (event) => {
//   console.log("fetch", event.request.destination, event.request.url);
// });

if (process.env.NODE_ENV === "production") {
  // This is where rollup-plugin-workbox-inject will inject the list of static app
  // files.
  precacheAndRoute(self.__WB_MANIFEST);
} else {
  // For development serve app assets from network always. Only works if precacheAndRoute
  // (above) is commented out
  registerRoute(
    ({ request }) => new URL(request.url).origin === self.origin,
    new NetworkOnly()
  );
}

// Get rid of workbox logging warnings concerning livereload.js
registerRoute(/.*\/livereload.js(\?.+)[0, 1]/, new NetworkOnly());

// Get audio data from network only for the time being
registerRoute(
  ({ request }) =>
    request.destination === "audio" || request.destination === "video", // NOTE: due to a bug in chromium, we also check for video
  ({ request }) => {
    if (request.headers.has("range")) {
      request = new Request(request, {
        headers: {
          "access-control-request-headers": "range",
        },
      });
    }
    // return event.respondWith(fetch(request));
    return new NetworkOnly().handle({ request });
  }
);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Everything that is not one of the static web files, image or audio is expected to be
// some show/episode metadata like titles, descriptions, images in xml or json format.
if (process.env.NODE_ENV === "production") {
  setDefaultHandler(
    new StaleWhileRevalidate({
      cacheName: "metadata",
    })
  );
} else {
  setDefaultHandler(
    new CacheFirst({
      cacheName: "metadata",
    })
  );
}
