<script>
  import { createEventDispatcher } from "svelte";

  export let episodes;
  export let selectedIndices;

  const dispatch = createEventDispatcher();

  function handleItemClick(episodeIndex) {
    const index = selectedIndices.indexOf(episodeIndex);
    if (index === -1) {
      selectedIndices = [...selectedIndices, episodeIndex];
    } else {
      selectedIndices = selectedIndices.filter((i) => i !== episodeIndex);
    }
    dispatch("change", { selectedIndices });
  }
</script>

<style>
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
