<script context="module">
  export function makeUrl(rssFeedUrl) {
    return `rssFeedUrl=${encodeURIComponent(rssFeedUrl)}`;
  }
  function rssFeedUrlFromQuery() {
    return decodeURIComponent(parseQuery(window.location.search).rssFeedUrl);
  }
</script>

<script>
  import EpisodesOfShow from "../EpisodesOfShow.svelte";
  import { enqueue } from "../playlistService";
  import {
    episodeRecord,
    fetchShow,
    showRecord,
  } from "../providers/rss/providerRss";
  import Show from "../Show.svelte";
  import { subscribeToShow } from "../showService";
  import { parseQuery } from "../urls";

  const rssFeedUrl = rssFeedUrlFromQuery();
  const showPromise = fetchShow({ rssFeedUrl });

  function handleSubscribeClick() {
    subscribeToShow(showRecord({ rssFeedUrl }));
  }

  function handleQueueEpisode({ detail: { episode } }) {
    enqueue(showRecord({ rssFeedUrl }), episodeRecord(episode));
  }
</script>

{#await showPromise then show}
  <Show {show} />
  <button on:click={handleSubscribeClick}>Subscribe</button>
  <EpisodesOfShow
    episodes={show.episodes}
    on:queueepisode={handleQueueEpisode} />
{/await}
