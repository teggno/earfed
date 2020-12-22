<script context="module">
  import { parseQuery } from "../urls";

  export function makeUrl(rssFeedUrl) {
    return `rssFeedUrl=${encodeURIComponent(rssFeedUrl)}`;
  }
  function rssFeedUrlFromQuery() {
    return decodeURIComponent(parseQuery(window.location.search).rssFeedUrl);
  }
</script>

<script>
  import EpisodesOfShow from "../EpisodesOfShow.svelte";
  import { refreshPlaylist } from "../playlistService";
  import {
    fetchShow,
    queueEpisode,
    subscribeToShow,
  } from "../providers/rss/providerRss";
  import Show from "../Show.svelte";
  import { refreshShows } from "../showService";

  let rssFeedUrl = rssFeedUrlFromQuery();
  let showPromise = fetchShow({ rssFeedUrl });

  async function handleSubscribeClick() {
    await subscribeToShow(rssFeedUrl, new Date());
    refreshShows();
  }

  async function handleQueueEpisode({ detail: { episode } }) {
    await queueEpisode({ rssFeedUrl, guid: episode.guid }, new Date());
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
