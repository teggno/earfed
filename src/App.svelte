<script>
  import { onMount } from "svelte";
  import AddShowRss from "./AddShowRss.svelte";
  import { initAnimationTargetRect } from "./animationTargetRect";
  import BottomBar from "./BottomBar.svelte";
  import { areEpisodesEqual } from "./episode";
  import { connectNotificationBar } from "./notificationBarService";
  import NowPlaying from "./NowPlaying.svelte";
  import * as playerService from "./playerService";
  import Playlist from "./Playlist.svelte";
  import Route from "./routing/Route.svelte";
  import Router from "./routing/Router.svelte";
  import Shows from "./Shows.svelte";
  import ShowSubscription from "./ShowSubscription.svelte";

  initAnimationTargetRect();

  onMount(() => {
    registerServiceWorker();
    return connectNotificationBarToPlayerService();
  });

  function connectNotificationBarToPlayerService() {
    const updater = connectNotificationBar(playerService);
    let currentEpisode;
    return playerService.playerInfo.subscribe((info) => {
      if (info.episode && !areEpisodesEqual(info.episode, currentEpisode)) {
        updater(info.episode);
      }
      currentEpisode = info.episode;
    });
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return Promise.resolve();

    return navigator.serviceWorker.register("/service-worker.js").then(
      (registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
        if (!registration.installing) {
          console.log("updating app files");
          const appV1 = "app-v1";
          const indexHtmlFiles = [
            "/" /* index.html itself */,
            "manifest.webmanifest",
            "global.css",
            "favicon.png",
            "/build/bundle.js",
            "/build/bundle.css",
            "/icons/earfedicon-apple-touch.png",
          ];
          window.caches
            .open(appV1)
            .then((cache) => cache.addAll(indexHtmlFiles));
        }
        // console.log("installing", registration.installing);
        // console.log("waiting", registration.waiting);
        // console.log("active", registration.active);
      },
      (err) => {
        console.error("ServiceWorker registration failed: ", err);
      }
    );
  }
</script>

<style>
</style>

<div class="container">
  <main>
    <Router>
      <Route component={Playlist} path="" />
      <Route component={Shows} path="shows" />
      <Route component={AddShowRss} path="shows/addrss" />
      <Route component={ShowSubscription} path="shows/subscribe" />
    </Router>
    <NowPlaying />
  </main>
  <BottomBar />
</div>
