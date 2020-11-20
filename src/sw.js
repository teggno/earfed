import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { setDefaultHandler } from "workbox-routing";
import {
  CacheFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// This is where rollup-plugin-workbox-inject will inject the list of static app
// files.
//precacheAndRoute(self.__WB_MANIFEST);

// For development serve app assets from network always. Only works if precacheAndRoute
// (above) is commented out
registerRoute(
  ({ request }) => new URL(request.url).origin === self.origin,
  new NetworkOnly()
);

// Get rid of workbox logging warnings concerning livereload.js
registerRoute(/.*\/livereload.js(\?.+)[0, 1]/, new NetworkOnly());

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
      // For requesting images that don't have the CORS headers. This is to be removed
      // when images are fetched from Earfed's own image processing endpoint because
      // that endpoint will either not be CORS or it will but then have the headers.
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Everything that is not one of the static web files or audio is expected to be
// some show/episode metadata like titles, descriptions, images.

// TODO: Change to StaleWhileRevalidate in production
setDefaultHandler(
  new CacheFirst({
    cacheName: "metadata",
  })
);
