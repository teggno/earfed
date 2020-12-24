<script context="module">
  export function makeUrl(collectionId) {
    return `/search/shows/apple/${collectionId}`;
  }

  function collectionIdFromUrl() {
    const parts = location.href.split("/");
    return parts[parts.length - 1];
  }
</script>

<script>
  import { derived } from "svelte/store";
  import EpisodesOfShow from "../EpisodesOfShow.svelte";
  import { enqueue, playlist as playlistState } from "../playlistService";
  import {
    episodeRecord,
    fetchShow,
    showRecord,
  } from "../providers/apple/providerApple";
  import Show from "../Show.svelte";
  import {
    subscribeToShow,
    unsubscribeFromShow,
    userDataShowsState,
  } from "../showService";
  import { loaded, threeStateFromPromise, whenLoaded } from "../threeState";
  import { status } from "../userData/shows";

  const collectionId = collectionIdFromUrl();

  const appleShowState = threeStateFromPromise(fetchShow({ collectionId }));

  const showState = derived(
    [appleShowState, userDataShowsState],
    whenLoaded(([appleShow, userDataShows]) => ({
      ...appleShow,
      subscribed: userDataShows.some(
        (uds) =>
          uds.showId.providerShowId === collectionId &&
          uds.status.value === status.subscribed
      ),
    }))
  );

  const episodesState = derived(
    [appleShowState, playlistState],
    whenLoaded(([show, playlist]) =>
      show.episodes.map((e) => ({
        ...e,
        queued: playlist.some((ple) => ple.trackId === e.trackId),
      }))
    )
  );

  function handleSubscribe() {
    subscribeToShow(showRecord({ collectionId }));
  }

  function handleUnsubscribe() {
    unsubscribeFromShow(showRecord({ collectionId }));
  }

  function handleQueueEpisode({ detail: { episode } }) {
    enqueue(showRecord({ collectionId }), episodeRecord(episode));
  }
</script>

{#if $showState.state === loaded}
  <Show
    show={$showState.data}
    on:subscribe={handleSubscribe}
    on:unsubscribe={handleUnsubscribe} />
{/if}
{#if $episodesState.state === loaded}
  <EpisodesOfShow
    episodes={$episodesState.data}
    on:queueepisode={handleQueueEpisode} />
{/if}
