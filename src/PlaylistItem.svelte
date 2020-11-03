<script>
  import { play } from "./playerService";

  import ShowIcon from "./ShowIcon.svelte";

  export let episode;

  const { showIconUrl, showName, episodeTitle } = episode;

  function handlePlayClick() {
    play(episode);
  }
</script>

<style>
  li {
    display: flex;
    padding: var(--spacing-3);
    cursor: pointer;
  }

  li:hover {
    background-color: var(--background-hover-list);
  }

  .showName {
    font-size: var(--font-size-small);
    color: var(--color-text-muted);
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .episodeTitle {
    margin: var(--spacing-1) 0 0 0;
    padding: 0;
    font-size: var(--font-size-medium);
    font-weight: normal;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .text {
    margin-left: var(--spacing-3);
    min-width: 0;
  }

  li :global(:first-child) {
    flex-shrink: 0;
  }
</style>

<li>
  <ShowIcon {showIconUrl} {showName} on:click={handlePlayClick} />
  <div class="text">
    <div class="showName">{showName}</div>
    <h2 class="episodeTitle">{episodeTitle}</h2>
  </div>
</li>
