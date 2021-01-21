<script lang="ts">
  import { onMount } from "svelte";
  import { initAnimationTargetRect } from "./animationTargetRect";
  import BottomBar from "./BottomBar.svelte";
  import type AppleEpisode from "./domain/AppleEpisode";
  import type RssEpisode from "./domain/RssEpisode";
  import { refreshUserDataEpisodes } from "./episodeService";
  import {
    connectNotificationBar,
    supportsNotificationBar,
  } from "./notificationBarService";
  import NowPlaying, { sizes } from "./nowPlaying/NowPlaying.svelte";
  import player from "./player/player";
  import QueuePage from "./queue/QueuePage.svelte";
  import {
    episodeAfter,
    firstEpisode,
    lastPlayedEpisode,
    queueState,
  } from "./queueService";
  import Route from "./routing/Route.svelte";
  import Router from "./routing/Router.svelte";
  import AppleShowPage from "./search/AppleShowPage.svelte";
  import Search from "./search/Search.svelte";
  import AddShowRss from "./subscriptions/AddShowRss.svelte";
  import RssShowPage from "./subscriptions/RssShowPage.svelte";
  import Subscriptions from "./subscriptions/Subscriptions.svelte";
  import { loaded } from "./threeState";
  import { setEpisodeEnded, updatePositionSeconds } from "./userData/episodes";
  import virtualKeyboardDetector, {
    virtualkeyboard,
  } from "./virtualKeyboardDetector";

  initAnimationTargetRect();

  let showImageUrls: string[] | undefined;
  let virtualKeyboardVisible = false;
  let nowPlayingVisible = true;

  onMount(() => {
    registerServiceWorker();
    const unsubscribers = [
      connectNotificationBarToPlayerService(),
      startUpdatingDbWithPlayerStatus(),
      playSubsequentEpisodeWhenEnded(),
      preloadNotificationBarShowImages(),
      virtualKeyboardDetector(),
      watchVirtualKeyboard(),
      presentNowPlaying(),
      syncWindowHeightToBody(),
    ];

    setLastPlayedEpisode();

    return () => {
      unsubscribers.forEach((u) => u());
    };
  });

  function syncWindowHeightToBody() {
    // I tried setting the body's min-height just using CSS. But there always was some
    // problem in some mobile browser. Now, as this app doesn't run without JS anyway,
    // it doesn't hurt using JS for setting the minHeight either.
    handleResize();
    function handleResize() {
      document.body.style.minHeight = `${window.innerHeight}px`;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }

  async function setLastPlayedEpisode() {
    const episode = await lastPlayedEpisode();
    if (!episode) return;

    player.setEpisode(episode);
    if (episode.positionSeconds) {
      player.seek(episode.positionSeconds);
    }
  }

  function connectNotificationBarToPlayerService() {
    const updater = connectNotificationBar(player);

    let previousEpisode: AppleEpisode | RssEpisode | undefined;
    return player.playerStore.subscribe((info) => {
      if (info.state === "hasEpisode") {
        const hasEpisodeChanged =
          info.episode.uniqueEpisodeId !== previousEpisode?.uniqueEpisodeId;
        if (hasEpisodeChanged) {
          updater({
            showTitle: info.episode.showTitle,
            episodeTitle: info.episode.episodeTitle,
            showImageUrlMedium: notificationBarImageUrl(info.episode),
          });
        }
        previousEpisode = info.episode;
      } else {
        previousEpisode = undefined;
      }
    });
  }

  function startUpdatingDbWithPlayerStatus() {
    return player.playerStore.subscribe(async (playerState) => {
      if (playerState.state === "noEpisode") return;

      const { episode, currentSecond } = playerState;
      if (playerState.playing) {
        await updatePositionSeconds(
          episode.episodeId,
          currentSecond,
          new Date()
        );
        refreshUserDataEpisodes();
      } else if (playerState.ended) {
        await setEpisodeEnded(episode.episodeId, new Date());
        refreshUserDataEpisodes();
      }
    });
  }

  function playSubsequentEpisodeWhenEnded() {
    return player.playerStore.subscribe(async (playerState) => {
      if (playerState.state === "hasEpisode" && playerState.ended) {
        const subsequentEpisode = await getEpisodeToPlayNext(
          playerState.episode
        );
        if (subsequentEpisode) {
          player.setEpisode(subsequentEpisode);
          if (subsequentEpisode.positionSeconds) {
            player.seek(subsequentEpisode.positionSeconds);
          }
          player.play();
        }
      }
    });
  }

  async function getEpisodeToPlayNext(
    currentEpisode: AppleEpisode | RssEpisode
  ) {
    const episode = (await episodeAfter(currentEpisode)) || firstEpisode();
    return episode &&
      currentEpisode?.uniqueEpisodeId === episode.uniqueEpisodeId
      ? undefined
      : episode;
  }

  function preloadNotificationBarShowImages() {
    if (!supportsNotificationBar()) return () => {};
    return queueState.subscribe((list) => {
      showImageUrls =
        list.state === loaded
          ? Object.keys(
              list.data.reduce((prev, queueItem) => {
                const url = notificationBarImageUrl(queueItem);
                if (url) prev[url] = true;
                return prev;
              }, {} as { [key: string]: boolean })
            )
          : [];
    });
  }

  function watchVirtualKeyboard() {
    window.addEventListener(virtualkeyboard as any, handleVirtualKeyboard);

    function handleVirtualKeyboard({ detail: { visible } }) {
      virtualKeyboardVisible = visible;
    }

    return () => {
      window.removeEventListener(virtualkeyboard as any, handleVirtualKeyboard);
    };
  }

  function presentNowPlaying() {
    let timeoutShow;
    let timeoutScrollCheck;
    let scrolling = false;
    let scrollHandlerAdded = false;
    let touching = false;

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
    };

    function handleTouchStart() {
      clearTimeout(timeoutShow);
      document.addEventListener("touchend", handleTouchEnd);
      touching = true;
      if (!scrollHandlerAdded) {
        window.addEventListener("scroll", handleScroll);
        scrollHandlerAdded = true;
      }
    }

    function handleScroll() {
      clearTimeout(timeoutScrollCheck);
      if (nowPlayingVisible && !scrolling) {
        hide();
      }
      scrolling = true;
      timeoutScrollCheck = setTimeout(() => {
        scrolling = false;
        if (!touching && scrollHandlerAdded) {
          window.removeEventListener("scroll", handleScroll);
          scrollHandlerAdded = false;
        }
        if (!nowPlayingVisible && !touching) {
          show();
        }
      }, 66);
    }

    function handleTouchEnd() {
      touching = false;
      document.removeEventListener("touchend", handleTouchEnd);
      if (!nowPlayingVisible && !scrolling) {
        show();
      }
      if (scrollHandlerAdded && !scrolling) {
        window.removeEventListener("scroll", handleScroll);
        scrollHandlerAdded = false;
      }
    }

    function show() {
      clearTimeout(timeoutShow);
      timeoutShow = setTimeout(() => {
        nowPlayingVisible = true;
      }, 1200);
    }

    function hide() {
      clearTimeout(timeoutShow);
      nowPlayingVisible = false;
    }
  }

  function notificationBarImageUrl(episode: {
    showImageUrlMedium: string | undefined;
  }) {
    return episode.showImageUrlMedium;
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

<div class:withBottomBarPadding={!virtualKeyboardVisible}>
  <main>
    <Router>
      <Route component={QueuePage} path="" />
      <Route component={Subscriptions} path="subscriptions" />
      <Route
        component={Search}
        path="search"
        getProps={(innerState) => innerState}
      />
      <Route component={AddShowRss} path="subscriptions/addrss" />
      <Route component={RssShowPage} path="subscriptions/shows/rss" />
      <Route
        component={AppleShowPage}
        path="search/shows/apple/:collectionId"
      />
      <Route
        component={AppleShowPage}
        path="subscriptions/shows/apple/:collectionId"
      />
    </Router>
  </main>
  {#if !virtualKeyboardVisible}
    <NowPlaying size={nowPlayingVisible ? sizes.medium : sizes.mini} />
    <BottomBar />
  {/if}
</div>

<svelte:head>
  <!-- 
    preload the (medium size) images displayed in the notification bar for two
    reasons:
    1. So that they are available offline even when none of a show's episodes has
       ever been played while online.
    2. The `mediaSession` API's `artwork` property doesn't allow specifying CORS
       which causes problems when caching the images while they are implicitly
       requested by `mediaSession`. The `<link rel="preload">` **does** support
       specifying CORS-->
  {#if showImageUrls}
    {#each showImageUrls as showImageUrl}
      <link
        rel="preload"
        href={showImageUrl}
        as="image"
        crossorigin="anonymous"
      />
    {/each}
  {/if}
</svelte:head>

<style>
  .withBottomBarPadding {
    padding-bottom: var(--bottom-bar-height);
  }
</style>
