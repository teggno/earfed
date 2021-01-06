<script context="module">
  export function makeUrl(rssFeedUrl) {
    return `rssFeedUrl=${encodeURIComponent(rssFeedUrl)}`;
  }

  function rssFeedUrlFromQuery() {
    return decodeURIComponent(parseQuery(window.location.search).rssFeedUrl);
  }
</script>

<script>
  import { derived } from "svelte/store";
  import EpisodesOfShow from "../EpisodesOfShow.svelte";
  import { enqueue, queueState } from "../queueService";
  import {
    episodeRecord,
    fetchShow,
    showRecord,
  } from "../providers/rss/providerRss";
  import Show from "../Show.svelte";
  import {
    subscribeToShow,
    unsubscribeFromShow,
    userDataShowsState,
  } from "../showService";
  import { loaded, threeStateFromPromise, whenLoaded } from "../threeState";
  import { parseQuery } from "../urls";
  import { status } from "../userData/shows";

  const rssFeedUrl = rssFeedUrlFromQuery();

  const rssShowState = threeStateFromPromise(fetchShow({ rssFeedUrl }));

  const showState = derived(
    [rssShowState, userDataShowsState],
    whenLoaded(([rssShow, userDataShows]) => ({
      ...rssShow,
      subscribed: userDataShows.some(
        (uds) =>
          uds.showId.providerShowId === rssFeedUrl &&
          uds.status.value === status.subscribed
      ),
    }))
  );

  const episodesState = derived(
    [rssShowState, queueState],
    whenLoaded(([show, queue]) =>
      show.episodes.map((e) => ({
        ...e,
        queued: queue.some((ple) => ple.guid === e.guid),
      }))
    )
  );

  function handleSubscribe() {
    subscribeToShow(showRecord({ rssFeedUrl }));
  }

  function handleUnsubscribe() {
    unsubscribeFromShow(showRecord({ rssFeedUrl }));
  }

  function handleQueueEpisode({ detail: { episode } }) {
    enqueue(showRecord({ rssFeedUrl }), episodeRecord(episode));
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
