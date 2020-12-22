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
  import EpisodesOfShow from "../EpisodesOfShow.svelte";
  import { enqueue } from "../playlistService";
  import {
    episodeRecord,
    fetchShow,
    showRecord,
  } from "../providers/apple/providerApple";
  import Show from "../Show.svelte";
  import { subscribeToShow } from "../showService";

  let collectionId = collectionIdFromUrl();
  let showPromise = fetchShow({ collectionId });

  function handleSubscribeClick() {
    subscribeToShow(showRecord({ collectionId }));
  }

  function handleQueueEpisode({ detail: { episode } }) {
    enqueue(showRecord({ collectionId }), episodeRecord(episode));
  }
</script>

{#await showPromise then show}
  <Show {show} />
  <button on:click={handleSubscribeClick}>Subscribe</button>
  <EpisodesOfShow
    episodes={show.episodes}
    on:queueepisode={handleQueueEpisode} />
{/await}
