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
  import { playlist, refreshPlaylist } from "./playlistService";
  import Route from "./routing/Route.svelte";
  import Router from "./routing/Router.svelte";
  import Shows from "./Shows.svelte";
  import ShowSubscription from "./ShowSubscription.svelte";
  import { status, updatePositionSeconds } from "./userData/episodes";

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
    let unsubscribe;
    new Promise((resolve) => {
      unsubscribe = playlist.subscribe(({ state, data }) => {
        if (state === "loaded") {
          resolve(data);
        }
      });
    }).then((data) => {
      unsubscribe();
      const episode = findLastPlayedEpisode(data);
      if (!episode) return;
      playerService.play(episode, true);
    });
  }

  function findLastPlayedEpisode(episodes) {
    return episodes
      .filter((e) => e.status.value === status.listed && e.positionSeconds)
      .sort(
        (a, b) =>
          b.positionSeconds.updated.valueOf() -
          a.positionSeconds.updated.valueOf()
      )[0];
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
    return playerService.playerInfo.subscribe(async (info) => {
      if (!info.episode || info.status !== playerService.playing) return;

      await updatePositionSeconds(
        info.episode.episodeId,
        info.currentSecond,
        new Date()
      );
      refreshPlaylist();
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
      <Route component={Playlist} path="" getProps={() => ({ playlist })} />
      <Route component={Shows} path="shows" />
      <Route component={AddShowRss} path="shows/addrss" />
      <Route component={ShowSubscription} path="shows/subscribe" />
    </Router>
    <NowPlaying />
  </main>
  <BottomBar />
</div>
