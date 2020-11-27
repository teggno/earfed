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
  import {
    episodeAfter,
    lastPlayedEpisode,
    playlist,
    refreshPlaylist,
  } from "./playlistService";
  import Route from "./routing/Route.svelte";
  import Router from "./routing/Router.svelte";
  import Shows from "./Shows.svelte";
  import ShowSubscription from "./ShowSubscription.svelte";
  import { setEnded, updatePositionSeconds } from "./userData/episodes";

  initAnimationTargetRect();

  onMount(() => {
    registerServiceWorker();
    const u1 = connectNotificationBarToPlayerService();
    const u2 = startUpdatingDbWithPlayerStatus();
    setLastPlayedEpisode();
    return () => {
      u1();
      u2();
    };
  });

  function setLastPlayedEpisode() {
    lastPlayedEpisode().then((episode) => {
      if (!episode) return;
      playerService.play(episode, true);
    });
  }

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

  function startUpdatingDbWithPlayerStatus() {
    return playerService.playerInfo.subscribe(
      async ({ episode, status, currentSecond }) => {
        if (!episode) return;

        if (status == playerService.playing) {
          await updatePositionSeconds(
            episode.episodeId,
            currentSecond,
            new Date()
          );
          refreshPlaylist();
        } else if (status === playerService.ended) {
          const episodeToPlayNext = await episodeAfter(episode);
          if (episodeToPlayNext) {
            playerService.play(episodeToPlayNext);
          }
          await setEnded(episode.episodeId, new Date());
          refreshPlaylist();
        }
      }
    );
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
      <Route component={Playlist} path="" getProps={() => ({ playlist })} />
      <Route component={Shows} path="shows" />
      <Route component={AddShowRss} path="shows/addrss" />
      <Route component={ShowSubscription} path="shows/subscribe" />
    </Router>
    <NowPlaying />
  </main>
  <BottomBar />
</div>
