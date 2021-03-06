<script lang="ts">
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import { episodes as userDataEpisodesStore } from "../episodeService";
  import ListLayout from "../layouts/ListLayout.svelte";
  import { getGlobalProgressbar } from "../progressbar/globalProgressbar";
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
  import Tabs from "../tabs/Tabs.svelte";
  import {
    anyLoading,
    lastValueWhileLoading,
    loaded,
    whenLoaded,
    writableThreeState,
  } from "../threeState";
  import type { AppleTrack } from "../userData/episodeTypes";
  import type { AppleCollection } from "../userData/showTypes";
  import { debounce } from "../utils";
  import EpisodeItem from "./EpisodeItem.svelte";
  import SearchForm from "./SearchForm.svelte";
  import ShowList from "./ShowList.svelte";

  export let searchText = "";
  export let pageYOffset = undefined;
  // selectedTabIndex is exported because it might come from history state
  export let selectedTabIndex: number | undefined = undefined;

  let tabItems = [
    { title: "Shows", disabled: false },
    { title: "Episodes", disabled: false },
  ];

  let searched = false;
  let searchFormFocused: boolean;

  const progress = getGlobalProgressbar();

  const appleShowsStore = writableThreeState<AppleCollection[]>();
  const appleEpisodesStore = writableThreeState<AppleTrack[]>();
  const episodesStore = derived(
    [userDataEpisodesStore, appleEpisodesStore],
    whenLoaded(([userDataEpisodes, appleEpisodes]) =>
      appleEpisodes.map((ae) => ({
        ...ae,
        queueStatus: userDataEpisodes.find(
          (ue) => appleUniqueEpisodeId(ae.trackId) === ue.uniqueEpisodeId
        )?.queueStatus,
      }))
    )
  );
  const enqueueingStore = writableThreeState<undefined>();

  $: shows = $appleShowsStore;

  const episodesWithLastLoadedValue = derived(
    episodesStore,
    lastValueWhileLoading()
  );
  $: episodes = $episodesWithLastLoadedValue;
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

    const unsubscribe = derived(
      [appleShowsStore, episodesStore, enqueueingStore],
      anyLoading
    ).subscribe((loading) => (loading ? progress.show() : progress.hide()));
    return () => {
      window.removeEventListener("scroll", debounced);
      progress.hide();
      unsubscribe();
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
    appleShowsStore.setLoading();
    appleEpisodesStore.setLoading();
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
      appleShowsStore.setLoaded(appleCollections);
      appleEpisodesStore.setLoaded(appleTracks);

      tabItems = tabItems.map((item, index) => ({
        ...item,
        disabled:
          (index === 0 && !appleCollections.length) ||
          (index === 1 && !appleTracks.length),
      }));

      if (
        selectedTabIndex === undefined ||
        tabItems[selectedTabIndex].disabled
      ) {
        const indexOfFirstEnabled = tabItems.findIndex(
          (item) => !item.disabled
        );
        console.log(indexOfFirstEnabled);
        selectedTabIndex =
          indexOfFirstEnabled === -1 ? undefined : indexOfFirstEnabled;
      }
    });
  }

  function handleSearch({ detail: { searchText: newSearchText } }) {
    searchText = newSearchText;
    search().then(() => {
      replaceState((old) => ({ ...old, searchText }));
    });
  }

  async function handleQueueEpisode(track: AppleTrack) {
    enqueueingStore.setLoading();
    await enqueueAppleTrack(track);
    enqueueingStore.setLoaded(undefined);
  }

  function handleTabChange({ detail: { selectedIndex } }) {
    selectedTabIndex = selectedIndex;
    replaceState((old) => ({ ...old, selectedTabIndex }));
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

{#if selectedTabIndex !== undefined}
  <Tabs
    items={tabItems}
    value={tabItems[selectedTabIndex]}
    on:change={handleTabChange}
    let:item
  >
    {item.title}
  </Tabs>
{/if}
{#if shows.state === loaded && shows.data.length && selectedTabIndex === 0}
  <ShowList shows={shows.data} />
{/if}
{#if episodes.state === loaded && episodes.data.length && selectedTabIndex === 1}
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
    --title-font-size: var(--font-size-large);
    --assumed-title-height: calc(
      var(--assumed-normal-lh) * var(--title-font-size)
    );
    position: relative;
    padding: var(--spacing-3);
    /*the goal here is to initially have the search form vertically 
    centered between the mini player and the top of the page*/
    transform: translateY(
      calc(
        (100vh - var(--mini-player-bottom) - var(--mini-player-height)) / 2 -
          50% + var(--assumed-title-height) / 2
      )
    );
    transition: transform 0.4s;
  }

  .searchOnTop {
    transform: none;
  }

  .title {
    position: absolute;
    top: 0;
    font-size: var(--font-size-large);
    transform: translateY(-100%);
    opacity: 1;
    transition: all 0.4s 0.2s;
  }

  .searchOnTop .title {
    transition: all 0.2s;
    opacity: 0;
  }
</style>
