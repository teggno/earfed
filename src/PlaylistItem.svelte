<script>
  import ShowIcon from "./ShowIcon.svelte";

  export let episode;
  export let playButtonRect;

  $: ({ showIconUrl, showName, episodeTitle } = episode);
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
  }

  .episodeTitle {
    margin: var(--spacing-1) 0 0 0;
    padding: 0;
    font-size: var(--font-size-medium);
    font-weight: normal;
  }

  .text {
    margin-left: var(--spacing-3);
  }
</style>

<li>
  <ShowIcon {showIconUrl} {showName} {playButtonRect} />
  <div class="text">
    <div class="showName">{showName}</div>
    <h2 class="episodeTitle">{episodeTitle}</h2>
  </div>
</li>
