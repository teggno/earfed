<script lang="ts">
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import { episodes as userDataEpisodesStore } from "../episodeService";
  import ListLayout from "../layouts/ListLayout.svelte";
  import PageTitle from "../PageTitle.svelte";
  import { appleUniqueEpisodeId } from "../providers";
  import { searchEpisodes, searchShows } from "../providers/apple/api";
  import {
    isValidCollection,
    isValidTrack,
    validateCollection,
    validateTrack,
  } from "../providers/apple/appleValidation";
  import { enqueueAppleTrack } from "../queueService";
  import { replaceState } from "../routing/Router.svelte";
  import { loaded, whenLoaded, writableThreeState } from "../threeState";
  import type { AppleTrack } from "../userData/episodeTypes";
  import type { AppleCollection } from "../userData/showTypes";
  import { debounce } from "../utils";
  import EpisodeItem from "./EpisodeItem.svelte";
  import SearchForm from "./SearchForm.svelte";
  import ShowList from "./ShowList.svelte";
  import { scale } from "svelte/transition";
  import { linear } from "svelte/easing";

  export let searchText = "";
  export let pageYOffset = undefined;
  export let showingShows = true;

  let searched = false;
  let searchFormFocused: boolean;
  let shows: AppleCollection[] = [];
  const foundEpisodesStore = writableThreeState<AppleTrack[]>();

  const episodesStore = derived(
    [userDataEpisodesStore, foundEpisodesStore],
    whenLoaded(([userDataEpisodes, appleEpisodes]) =>
      appleEpisodes.map((ae) => ({
        ...ae,
        queueStatus: userDataEpisodes.find(
          (ue) => appleUniqueEpisodeId(ae.trackId) === ue.uniqueEpisodeId
        )?.queueStatus,
      }))
    )
  );
  $: episodes = $episodesStore;
  $: searchOnTop = searched || searchFormFocused;

  onMount(() => {
    const debounced = debounce(handleScroll);
    window.addEventListener("scroll", debounced);

    if (searchText && searchText.trim()) {
      search().then(() => {
        if (typeof pageYOffset !== "undefined") {
          window.scrollTo({ top: pageYOffset });
        }
      });
    }

    return () => {
      window.removeEventListener("scroll", debounced);
    };
  });

  function handleScroll() {
    replaceState((old) => ({
      ...old,
      pageYOffset: window.pageYOffset,
    }));
  }

  function search() {
    searched = true;
    return Promise.all([
      searchShows(searchText).then(({ results }) =>
        results
          .map((fetchedCollection) => validateCollection(fetchedCollection))
          .filter(isValidCollection)
          .map(({ appleCollection }) => appleCollection)
      ),
      searchEpisodes(searchText).then(({ results }) =>
        results
          .map((fetchedCollection) => validateTrack(fetchedCollection))
          .filter(isValidTrack)
          .map(({ appleTrack }) => appleTrack)
      ),
    ]).then(([appleCollections, appleTracks]) => {
      shows = appleCollections;
      foundEpisodesStore.setLoaded(appleTracks);

      if (showingShows && !shows.length && appleTracks.length) {
        showingShows = false;
      } else if (!showingShows && !appleTracks.length && shows.length) {
        showingShows = true;
      }
    });
  }

  function handleSearch({ detail: { searchText: newSearchText } }) {
    searchText = newSearchText;
    search().then(() => {
      replaceState((old) => ({ ...old, searchText }));
    });
  }

  function handleShowsClick() {
    showingShows = true;
    replaceState((old) => ({ ...old, showingShows }));
  }

  function handleEpisodesClick() {
    showingShows = false;
    replaceState((old) => ({ ...old, showingShows }));
  }

  async function handleQueueEpisode(track: AppleTrack) {
    enqueueAppleTrack(track);
  }
</script>

<div class="searchFormWrapper" class:searchOnTop>
  <div class="title">Search</div>
  <SearchForm
    bind:focused={searchFormFocused}
    {searchText}
    on:search={handleSearch}
  />
</div>
{#if shows.length && episodes.state === loaded && episodes.data.length}
  <div>
    <button on:click={handleShowsClick} type="button" disabled={showingShows}
      >Shows ({shows.length})</button
    >
    <button
      on:click={handleEpisodesClick}
      type="button"
      disabled={!showingShows}>Episodes ({episodes.data.length})</button
    >
  </div>
{/if}
{#if shows.length && showingShows}
  <h2>Shows</h2>
  <ShowList {shows} />
{/if}
{#if episodes.state === loaded && episodes.data.length && (!showingShows || !shows.length)}
  <h2>Episodes</h2>
  <ListLayout items={episodes.data} let:item={episode}>
    <EpisodeItem
      {episode}
      on:queueepisode={() => {
        handleQueueEpisode(episode);
      }}
    />
  </ListLayout>
{/if}

<style>
  .searchFormWrapper {
    position: relative;
    padding: var(--spacing-3);
    /*the goal here is to initially have the search form vertically 
    centered between the mini player and the top of the page*/
    transform: translateY(
      calc(
        (100vh - var(--mini-player-bottom) - var(--mini-player-height)) / 2 -
          50%
      )
    );
    transition: transform 0.4s;
  }

  .searchOnTop {
    transform: none;
  }

  .title {
    font-size: var(--font-size-large);
    overflow-y: hidden;
    transition: all 0.2s;
    opacity: 1;
    max-height: calc(
      var(--assumed-normal-lh) * var(--font-size-large) + 2 * var(--spacing-1)
    );
    padding: var(--spacing-1) 0;
  }

  .searchOnTop .title {
    max-height: 0;
    opacity: 0;
  }
</style>
