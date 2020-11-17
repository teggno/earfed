<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { providerByMapping } from "./providers/providers";
  import { parseQuery } from "./urls";
  import { arrayOfLength } from "./utils";

  let show;
  let episodes = [];
  let selectedIndices = [];
  let provider;

  const dispatch = createEventDispatcher();

  onMount(() => {
    const providerMapping = providerMappingFromQuery();
    provider = providerByMapping(providerMapping);
    loadShow(providerMapping);
  });

  function loadShow(providerMapping) {
    provider.fetchShow(providerMapping).then((fetchedShow) => {
      show = fetchedShow;
      episodes = fetchedShow.episodes.sort(
        (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
      );
      selectedIndices = arrayOfLength(Math.min(5, episodes.length), (i) => i);
    });
  }

  async function handleClick() {
    const providerMapping = providerMappingFromQuery();
    const show = await provider.subscribeToShow(providerMapping);

    const episodesToAdd = selectedIndices.map((i) => episodes[i]);
    await provider.addEpisodes(show.showId, episodesToAdd);
    // dispatch("subscribe");
  }

  function providerMappingFromQuery() {
    const query = parseQuery(window.location.search);
    return decodeValues(query);
  }

  function handleItemClick(episodeIndex) {
    const index = selectedIndices.indexOf(episodeIndex);
    if (index === -1) {
      selectedIndices = [...selectedIndices, episodeIndex];
    } else {
      selectedIndices = selectedIndices.filter((i) => i !== episodeIndex);
    }
  }

  function decodeValues(map) {
    return Object.keys(map).reduce((prev, key) => {
      prev[key] = decodeURIComponent(map[key]);
      return prev;
    }, {});
  }
</script>

<style>
  img {
    width: 10%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  label {
    font-size: var(--font-size-normal);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    padding-bottom: var(--spacing-1);
  }

  li {
    display: flex;
    align-items: center;
    padding: var(--spacing-3);
  }

  li :global(*) {
    cursor: inherit;
  }

  input {
    margin-right: var(--spacing-3);
  }

  .pubDate {
    font-size: var(--font-size-small);
    color: var(--color-text-muted);
  }

  .text {
    overflow-x: hidden;
  }

  @media (hover: hover) {
    li:hover {
      background-color: var(--background-hover-list);
    }
  }
</style>

{#if show}
  <div>
    <img src={show.showIconUrl} alt="" />
    <h2>{show.showName}</h2>
    <!-- <div>{show.showDescription}</div> -->
  </div>
  <button on:click={handleClick}>Subscribe</button>
  <ul>
    {#each episodes as episode, i}
      <li class="pointer" on:click={() => handleItemClick(i)}>
        <input
          type="checkbox"
          on:change|preventDefault
          checked={selectedIndices.indexOf(i) !== -1}
          id={`cb-${i}`} />
        <div class="text">
          <label
            for={`cb-${i}`}
            on:click|preventDefault>{episode.episodeTitle}</label>
          <div class="pubDate">{episode.pubDate.toDateString()}</div>
        </div>
      </li>
    {/each}
  </ul>
{/if}
