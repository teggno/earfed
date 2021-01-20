<script context="module" lang="ts">
  export function makeUrl(rssFeedUrl: string) {
    return `rssFeedUrl=${encodeURIComponent(rssFeedUrl)}`;
  }

  function rssFeedUrlFromQuery() {
    return decodeURIComponent(parseQuery(window.location.search).rssFeedUrl);
  }
</script>

<script lang="ts">
  import { derived } from "svelte/store";
  import RssEpisode from "../domain/RssEpisode";
  import RssShow from "../domain/RssShow";
  import EpisodeOfShow from "../EpisodeOfShow.svelte";
  import { episodes as userDataEpisodesStore } from "../episodeService";
  import ListLayout from "../layouts/ListLayout.svelte";
  import { fetchChannel } from "../providers/rss/providerRss";
  import { enqueueRssItem } from "../queueService";
  import Show from "../Show.svelte";
  import {
    shows as userDataShowsState,
    subscribeToShow,
    unsubscribeFromShow,
  } from "../showService";
  import {
    loaded,
    makeError,
    makeInitial,
    makeLoaded,
    threeStateFromPromise,
    whenLoaded,
  } from "../threeState";
  import { parseQuery } from "../urls";
  import { arrayToMap } from "../utils";

  const rssFeedUrl = rssFeedUrlFromQuery();

  const channelStateStore = threeStateFromPromise(fetchChannel(rssFeedUrl));

  const showStateStore = derived(
    [userDataShowsState, channelStateStore],
    ([userDataShows, channelState], set) => {
      if (userDataShows.state === loaded) {
        const show = userDataShows.data.find(
          (show) => show instanceof RssShow && show.sameShow(rssFeedUrl)
        );
        if (show) {
          set(makeLoaded(show as RssShow));
        } else if (channelState.state === "loaded") {
          set(
            makeLoaded(new RssShow(rssFeedUrl, { value: channelState.data }))
          );
        } else if (channelState.state === "error") {
          set(makeError(channelState.error));
        }
      }
    },
    makeInitial<RssShow>()
  );
  $: showState = $showStateStore;

  const episodesStateStore = derived(
    [channelStateStore, userDataEpisodesStore, showStateStore],
    whenLoaded(([channel, userDataEpisodes, show]) => {
      const episodesFromDb = userDataEpisodes.filter(
        (ue): ue is RssEpisode =>
          ue instanceof RssEpisode && ue.uniqueShowId === show.uniqueShowId
      );
      const episodesById = arrayToMap(episodesFromDb, (e) => e.uniqueEpisodeId);
      const episodesNotInDb = channel.items
        .map((item) => new RssEpisode(item, show))
        .filter((e) => !episodesById[e.uniqueEpisodeId]);
      return [...episodesFromDb, ...episodesNotInDb]
        .sort(byPubDate)
        .map((episode) => ({
          episode,
          show,
        }));
    })
  );

  $: episodesState = $episodesStateStore;

  function handleSubscribe() {
    if (showState.state !== loaded) return;

    subscribeToShow(showState.data.makeShowInput());
  }

  function handleUnsubscribe() {
    if (showState.state !== loaded) return;

    unsubscribeFromShow(showState.data.makeShowId());
  }

  function handleQueueEpisode(episode: RssEpisode) {
    enqueueRssItem(rssFeedUrl, episode.item);
  }

  function byPubDate(a: RssEpisode, b: RssEpisode) {
    return (b.pubDate?.valueOf() ?? 0) - (a.pubDate?.valueOf() ?? 0);
  }
</script>

{#if showState.state === loaded}
  <Show
    show={showState.data}
    on:subscribe={handleSubscribe}
    on:unsubscribe={handleUnsubscribe}
  />
{/if}
{#if episodesState.state === loaded}
  <ListLayout items={episodesState.data} let:item={episodeAndShow}>
    <EpisodeOfShow
      episode={episodeAndShow.episode}
      on:queueepisode={() => handleQueueEpisode(episodeAndShow.episode)}
    />
  </ListLayout>
{/if}
