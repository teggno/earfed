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
    align-items: center;
    /* chrome on android makes stuff that has `cursor: pointer` 
       blue when tapped which is not wanted here */
    -webkit-tap-highlight-color: transparent;
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

  .square {
    --assumed-normal-lh: 1.2;
    --size: max(
      max(
        calc(
          var(--assumed-normal-lh) * var(--font-size-medium) +
            var(--assumed-normal-lh) * var(--font-size-small) + var(--spacing-1)
        ),
        9%
      ),
      44px
    );
    width: var(--size);
    padding-bottom: var(--size);
    height: 0;
    position: relative;
  }

  .square > :global(*) {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }
</style>

<li>
  <div class="square">
    <ShowIcon {showIconUrl} {showName} on:click={handlePlayClick} />
  </div>
  <div class="text">
    <div class="showName">{showName}</div>
    <h2 class="episodeTitle">{episodeTitle}</h2>
  </div>
</li>
