<script>
  import { searchShows, searchEpisodes } from "../providers/apple/api";
  import { makeUrl } from "./AppleShow.svelte";
  let searchText = "syntax";
  let shows = [];
  let episodes = [];
  let showingShows = true;

  function handleSubmit(e) {
    e.preventDefault();

    if (!searchText.trim()) return;

    search();
  }

  function search() {
    Promise.all([searchShows(searchText), searchEpisodes(searchText)]).then(
      ([{ results: s }, { results: e }]) => {
        shows = s;
        episodes = e;
      }
    );
  }

  function handleFocus(e) {
    e.target.select();
  }

  function handleShowsClick() {
    showingShows = true;
  }

  function handleEpisodesClick() {
    showingShows = false;
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
  }
  .subtitle {
    color: var(--color-text-muted);
  }

  .title,
  .subtitle {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }
  input {
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
          <div class="subtitle">{episode.collectionName}</div>
        </div>
      </li>
    {/each}
  </ul>
{/if}
