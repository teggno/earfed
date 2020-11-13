<script>
  import BottomBar from "./BottomBar.svelte";
  import NowPlaying from "./NowPlaying.svelte";
  import Playlist from "./Playlist.svelte";
  import { initAnimationTargetRect } from "./animationTargetRect";
  import * as playerService from "./playerService";
  import { connectNotificationBar } from "./notificationBarService";
  import { onMount } from "svelte";
  import { areEpisodesEqual } from "./episode";
  import Shows from "./Shows.svelte";

  let currentComponentName = "shows";

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
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  }

  const components = { playlist: Playlist, shows: Shows };

  function handleComponentChange({ detail: { selectedItemName } }) {
    console.log(selectedItemName);
    currentComponentName = selectedItemName;
  }
</script>

<style>
</style>

<div class="container">
  <main>
    <svelte:component this={components[currentComponentName]} />
    <NowPlaying />
  </main>
  <BottomBar
    selectedItemName={currentComponentName}
    on:change={handleComponentChange} />
</div>
