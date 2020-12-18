<script context="module">
  export function makeUrl(collectionId) {
    return `/search/shows/apple/${collectionId}`;
  }
  function extractCollectionId(url) {
    const parts = url.split("/");
    return parts[parts.length - 1];
  }
</script>

<script>
  import EpisodesOfShow from "../EpisodesOfShow.svelte";
  import {
    subscribeToShow,
    fetchShow,
    queueEpisode,
  } from "../providers/apple/providerApple";
  import Show from "../Show.svelte";
  import { refreshShows } from "../showService";
  import { refreshPlaylist } from "../playlistService";

  let collectionId = extractCollectionId(location.href);
  let showPromise = fetchShow({ collectionId });

  async function handleSubscribeClick() {
    await subscribeToShow(collectionId, new Date());
    refreshShows();
  }

  async function handleQueueEpisode({ detail: { episode } }) {
    await queueEpisode(episode);
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
