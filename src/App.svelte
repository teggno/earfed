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

    return navigator.serviceWorker.register("/sw.js").then(
      (registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
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
