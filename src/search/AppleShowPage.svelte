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
  import { threeStateFromPromise, whenLoaded } from "../threeState";
  import Show from "../Show.svelte";
  import { subscribeToShow } from "../showService";

  const collectionId = collectionIdFromUrl();

  const showState = threeStateFromPromise(fetchShow({ collectionId }));

  const episodesState = derived(
    [showState, playlistState],
    whenLoaded(([show, playlist]) =>
      show.episodes.map((e) => ({
        ...e,
        queued: playlist.some((ple) => ple.trackId === e.trackId),
      }))
    )
  );

  function handleSubscribeClick() {
    subscribeToShow(showRecord({ collectionId }));
  }

  function handleQueueEpisode({ detail: { episode } }) {
    enqueue(showRecord({ collectionId }), episodeRecord(episode));
  }
</script>

{#if $showState.state === 'loaded'}
  <Show show={$showState.data} />
  <button on:click={handleSubscribeClick}>Subscribe</button>
{/if}
{#if $episodesState.state === 'loaded'}
  <EpisodesOfShow
    episodes={$episodesState.data}
    on:queueepisode={handleQueueEpisode} />
{/if}