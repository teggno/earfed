<script context="module" lang="ts">
  export function makeUrl(collectionId: AppleCollectionId) {
    return `/search/shows/apple/${collectionId}`;
  }

  function collectionIdFromUrl(): AppleCollectionId {
    const parts = location.href.split("/");
    return parseInt(parts[parts.length - 1]);
  }
</script>

<script lang="ts">
  import { derived } from "svelte/store";
  import AppleEpisode from "../domain/AppleEpisode";
  import AppleShow from "../domain/AppleShow";
  import EpisodeOfShow from "../EpisodeOfShow.svelte";
  import { episodes as userDataEpisodesStore } from "../episodeService";
  import ListLayout from "../layouts/ListLayout.svelte";
  import {
    fetchCollection,
    fetchTracks,
  } from "../providers/apple/providerApple";
  import { enqueueAppleTrack } from "../queueService";
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
  import type { AppleTrack } from "../userData/episodeTypes";
  import type { AppleCollectionId } from "../userData/showTypes";
  import { arrayToMap } from "../utils";

  const collectionId = collectionIdFromUrl();

  const showStateStore = derived(
    userDataShowsState,
    (ts, set) => {
      if (ts.state === loaded) {
        const show = ts.data.find(
          (show) => show instanceof AppleShow && show.sameShow(collectionId)
        );
        if (show) {
          set(makeLoaded(show as AppleShow));
        } else {
          fetchCollection(collectionId)
            .then((collection) => new AppleShow({ value: collection }))
            .then(makeLoaded)
            .then(set)
            .catch((e) => {
              set(makeError(e));
            });
        }
      }
    },
    makeInitial<AppleShow>()
  );
  $: showState = $showStateStore;

  const tracksStateStore = threeStateFromPromise(
    fetchTracks(collectionId).catch(
      () =>
        // probably no network, ignore as we can at least return the episodes saved in indexeddb.
        [] as AppleTrack[]
    )
  );

  const episodesStateStore = derived(
    [tracksStateStore, userDataEpisodesStore, showStateStore],
    whenLoaded(([tracks, userDataEpisodes, show]) => {
      const episodesFromDb = userDataEpisodes.filter(
        (ue): ue is AppleEpisode =>
          ue instanceof AppleEpisode && ue.uniqueShowId === show.uniqueShowId
      );
      const episodesById = arrayToMap(episodesFromDb, (e) => e.uniqueEpisodeId);
      const episodesNotInDb = tracks
        .map((track) => new AppleEpisode(track, show))
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

  function handleQueueEpisode(episode: AppleEpisode) {
    enqueueAppleTrack(episode.track);
  }

  function byPubDate(a: AppleEpisode, b: AppleEpisode) {
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
