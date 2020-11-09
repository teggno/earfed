<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import ShowIcon from "./ShowIcon.svelte";

  export let episode;
  export let playing = false;
  export let expanded = false;

  const { showName, episodeTitle, episodeDescription } = episode;

  const dispatch = createEventDispatcher();

  function handleClickText() {
    dispatch("toggleExpanded");
  }
</script>

<style>
  li {
    padding: var(--spacing-3);
    cursor: pointer;
    /* fixes the slide animation on iOS safari */
    overflow: hidden;
    /* chrome on android makes stuff that has `cursor: pointer` 
       blue when tapped which is not wanted here */
    -webkit-tap-highlight-color: transparent;
    /* 400ms must be coordinated with the slide animation below */
    transition: background-color ease-out 400ms;
  }

  li.expanded {
    background-color: white;
  }

  .alwaysVisible {
    display: flex;
    align-items: center;
  }

  .alwaysVisible :global(:first-child) {
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

  .text {
    margin-left: var(--spacing-3);
    min-width: 0;
  }

  .episodeTitle {
    margin: 0 0 var(--spacing-1) 0;
    padding: 0;
    font-size: var(--font-size-medium);
    font-weight: normal;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .showName {
    font-size: var(--font-size-small);
    color: var(--color-text-muted);
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .episodeDescription {
    line-height: var(--lh-copy);
  }

  .detailsTop {
    padding: var(--spacing-3) 0;
  }

  @media (hover: hover) {
    li:hover:not(.expanded) {
      background-color: var(--background-hover-list);
    }
  }
</style>

<li class:expanded>
  <div class="alwaysVisible">
    <div class="square">
      <ShowIcon {episode} {playing} />
    </div>
    <div class="text" on:click={handleClickText}>
      <h2 class="episodeTitle">{episodeTitle}</h2>
      <div class="showName">{showName}</div>
    </div>
  </div>
  {#if expanded}
    <!--duration: 400 below must be coordinated with the transition on li -->
    <div transition:slide={{ duration: 400 }}>
      <div class="detailsTop">
        <div>32 min left</div>
      </div>
      <div class="episodeDescription">{episodeDescription}</div>
    </div>
  {/if}
</li>
