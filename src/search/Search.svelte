<script>
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import { searchEpisodes, searchShows } from "../providers/apple/api";
  import { apple } from "../providers/apple/providerApple";
  import { replaceState } from "../routing/Router.svelte";
  import { loaded, whenLoaded, writableThreeState } from "../threeState";
  import { debounce } from "../utils";
  import EpisodeList from "./EpisodeList.svelte";
  import SearchForm from "./SearchForm.svelte";
  import ShowList from "./ShowList.svelte";

  export let searchText = "";
  export let pageYOffset = undefined;
  export let showingShows = true;
  export let playlist;

  let shows = [];
  const appleEpisodesStore = writableThreeState();

  const episodes = derived(
    [playlist, appleEpisodesStore],
    whenLoaded(([queue, appleEpisodes]) =>
      appleEpisodes.map((ae) => ({
        ...ae,
        queued: queue.some((qe) => areEqual(ae, qe)),
      }))
    )
  );

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
    return Promise.all([
      searchShows(searchText),
      searchEpisodes(searchText),
    ]).then(([{ results: s }, { results: e }]) => {
      shows = s;
      appleEpisodesStore.setLoaded(e);

      if (showingShows && !shows.length && e.length) {
        showingShows = false;
      } else if (!showingShows && !e.length && shows.length) {
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

  function areEqual(
    { trackId },
    { episodeId: { provider, providerEpisodeId } }
  ) {
    return providerEpisodeId === trackId && provider === apple;
  }
</script>

<style>
</style>

<SearchForm {searchText} on:search={handleSearch} />
{#if shows.length && $episodes.state === loaded && $episodes.data.length}
  <div>
    <button
      on:click={handleShowsClick}
      type="button"
      disabled={showingShows}>Shows ({shows.length})</button>
    <button
      on:click={handleEpisodesClick}
      type="button"
      disabled={!showingShows}>Episodes ({$episodes.data.length})</button>
  </div>
{/if}
{#if shows.length && showingShows}
  <h2>Shows</h2>
  <ShowList {shows} />
{/if}
{#if $episodes.state === loaded && $episodes.data.length && (!showingShows || !shows.length)}
  <h2>Episodes</h2>
  <EpisodeList episodes={$episodes.data} />
{/if}
