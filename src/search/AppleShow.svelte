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
  import { refreshPlaylist } from "../playlistService";
  import {
    fetchShow,
    queueEpisode,
    subscribeToShow,
  } from "../providers/apple/providerApple";
  import Show from "../Show.svelte";
  import { refreshShows } from "../showService";

  let collectionId = collectionIdFromUrl();
  let showPromise = fetchShow({ collectionId });

  async function handleSubscribeClick() {
    await subscribeToShow(collectionId, new Date());
    refreshShows();
  }

  async function handleQueueEpisode({ detail: { episode } }) {
    await queueEpisode({ collectionId, trackId: episode.trackId }, new Date());
    refreshShows();
    refreshPlaylist();
  }
</script>

{#await showPromise then show}
  <Show {show} />
  <button on:click={handleSubscribeClick}>Subscribe</button>
  <EpisodesOfShow
    episodes={show.episodes}
    on:queueepisode={handleQueueEpisode} />
{/await}
