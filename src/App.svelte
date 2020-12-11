<script>
  import { onMount } from "svelte";
  import AddShowRss from "./subscriptions/AddShowRss.svelte";
  import { initAnimationTargetRect } from "./animationTargetRect";
  import AppleShow from "./search/AppleShow.svelte";
  import BottomBar from "./BottomBar.svelte";
  import { showImageUrlMedium } from "./config";
  import { areEpisodesEqual } from "./episode";
  import {
    connectNotificationBar,
    supportsNotificationBar,
  } from "./notificationBarService";
  import NowPlaying from "./nowPlaying/NowPlaying.svelte";
  import * as playerService from "./playerService";
  import Playlist from "./queue/Playlist.svelte";
  import {
    episodeAfter,
    lastPlayedEpisode,
    playlist,
    refreshPlaylist,
  } from "./playlistService";
  import Route from "./routing/Route.svelte";
  import Router from "./routing/Router.svelte";
  import Search from "./search/Search.svelte";
  import Subscriptions from "./subscriptions/Subscriptions.svelte";
  import ShowSubscription from "./subscriptions/RssShow.svelte";
  import { setEnded, updatePositionSeconds } from "./userData/episodes";
  import virtualKeyboardDetector, {
    virtualkeyboard,
  } from "./virtualKeyboardDetector";

  initAnimationTargetRect();

  let showImageUrls;
  let virtualKeyboardVisible = false;

  onMount(() => {
    registerServiceWorker();
    const unsubscribers = [
      connectNotificationBarToPlayerService(),
      startUpdatingDbWithPlayerStatus(),
      preloadNotificationBarShowImages(),
      virtualKeyboardDetector(),
      watchVirtualKeyboard(),
    ];

    setLastPlayedEpisode();

    return () => {
      unsubscribers.forEach((u) => u());
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

  function preloadNotificationBarShowImages() {
    if (!supportsNotificationBar()) return () => {};
    return playlist.subscribe((list) => {
      showImageUrls =
        list.state === "loaded"
          ? Object.keys(
              list.data.reduce((prev, playlistItem) => {
                prev[playlistItem.showImageUrl] = true;
                return prev;
              }, {})
            ).map(showImageUrlMedium)
          : [];
    });
  }

  function watchVirtualKeyboard() {
    window.addEventListener(virtualkeyboard, handleVirtualKeyboard);

    function handleVirtualKeyboard({ detail: { visible } }) {
      virtualKeyboardVisible = visible;
    }

    return () => {
      window.removeEventListener(virtualkeyboard, handleVirtualKeyboard);
    };
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
  .withBottomBarPadding {
    padding-bottom: var(--bottom-bar-height);
  }
</style>

<div class:withBottomBarPadding={!virtualKeyboardVisible}>
  <main>
    <Router>
      <Route component={Playlist} path="" getProps={() => ({ playlist })} />
      <Route component={Subscriptions} path="subscriptions" />
      <Route
        component={Search}
        path="search"
        getProps={(innerState) => innerState} />
      <Route component={AddShowRss} path="subscriptions/addrss" />
      <Route component={ShowSubscription} path="subscriptions/subscribe" />
      <Route component={AppleShow} path="search/shows/apple/:collectionId" />
    </Router>
  </main>
  {#if !virtualKeyboardVisible}
    <NowPlaying />
    <BottomBar />
  {/if}
</div>

<svelte:head>
  <!-- 
    preload the (medium size) images displayed in the notification bar for two
    reasons:
    1. So that they are available offline even when none of a show's episode has
       ever been played while online.
    2. The `mediaSession` API's `artwork` property doesn't allow specifying CORS
       which causes problems when caching the images while they are implicitly
       requested by `mediaSession`. The `<link rel="preload">` **does** support
       specifying CORS-->
  {#if showImageUrls}
    {#each showImageUrls as showImageUrl}
      <link rel="preload" href={showImageUrl} as="image" crossorigin />
    {/each}
  {/if}
</svelte:head>
