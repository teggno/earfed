<script>
  import { onMount } from "svelte";
  import { formatDate } from "../dates";
  import { searchShows, searchEpisodes } from "../providers/apple/api";
  import { replaceState } from "../routing/Router.svelte";
  import { debounce } from "../utils";
  import { makeUrl } from "./AppleShow.svelte";

  export let searchText = "";
  export let pageYOffset = undefined;
  export let showingShows = true;

  let shows = [];
  let episodes = [];

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
      episodes = e;

      if (showingShows && !shows.length && episodes.length) {
        showingShows = false;
      } else if (!showingShows && !episodes.length && shows.length) {
        showingShows = true;
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!searchText || !searchText.trim()) return;

    search().then(() => {
      replaceState((old) => ({ ...old, searchText }));
    });
  }
  function handleFocus(e) {
    e.target.select();
  }

  function handleShowsClick() {
    showingShows = true;
    replaceState((old) => ({ ...old, showingShows }));
  }

  function handleEpisodesClick() {
    showingShows = false;
    replaceState((old) => ({ ...old, showingShows }));
  }
</script>

<style>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .container {
    display: flex;
    align-items: center;
  }

  li:first-child {
    border-top: var(--spacing-4) solid transparent;
  }
  li {
    border-bottom: var(--spacing-3) solid transparent;
  }
  li a {
    text-decoration: none;
    color: inherit;
  }

  .rightOfImage {
    margin-left: var(--spacing-3);
    font-size: var(--font-size-small);
    min-width: 0;
  }

  .title {
    margin-bottom: var(--spacing-1);
    overflow: hidden;
    font-weight: 500;
  }
  .subtitle {
    color: var(--color-text-muted);
    margin-top: var(--spacing-1);
  }

  .subtitle {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }

  /* note: must make this some fixed size and not depend on 
  the actual image size to prevent having the document height 
  change while images are loaded. */
  img {
    width: 60px;
    height: 60px;
  }
</style>

<form on:submit={handleSubmit}>
  <label for="searchField">Search</label>
  <input
    id="searchField"
    type="search"
    on:focus={handleFocus}
    bind:value={searchText} />
  <button>Go</button>
</form>
{#if shows.length && episodes.length}
  <div>
    <button
      on:click={handleShowsClick}
      type="button"
      disabled={showingShows}>Shows ({shows.length})</button>
    <button
      on:click={handleEpisodesClick}
      type="button"
      disabled={!showingShows}>Episodes ({episodes.length})</button>
  </div>
{/if}
{#if shows.length && showingShows}
  <h2>Shows</h2>
  <ul>
    {#each shows as show}
      <li>
        <a href={makeUrl(show.collectionId)} class="container">
          <img src={show.artworkUrl60} alt="" crossorigin="anonymous" />
          <div class="rightOfImage">
            <div class="title">{show.collectionName}</div>
            <div class="subtitle">{show.artistName}</div>
          </div>
        </a>
      </li>
    {/each}
  </ul>
{/if}
{#if episodes.length && (!showingShows || !shows.length)}
  <h2>Episodes</h2>
  <ul>
    {#each episodes as episode}
      <li class="container">
        <img src={episode.artworkUrl60} alt="" crossorigin="anonymous" />
        <div class="rightOfImage">
          <div class="title">{episode.trackName}</div>
          <div class="subtitle">
            {formatDate(new Date(episode.releaseDate))}
            &#149;
            {episode.collectionName}
          </div>
          <a href={makeUrl(episode.collectionId)} class="container">Show</a>
        </div>
      </li>
    {/each}
  </ul>
{/if}
