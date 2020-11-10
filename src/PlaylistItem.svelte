<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { cubicOut, quadIn } from "svelte/easing";

  import ShowIcon from "./ShowIcon.svelte";

  export let episode;
  export let playing = false;
  export let expanded = false;
  export let delayInTransition = false;

  const { showName, episodeTitle, episodeDescription } = episode;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("toggleExpanded");
  }
</script>

<style>
  li {
    cursor: pointer;
    /* fixes the slide animation on Safari */
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

  li.expanded .alwaysVisible {
    animation: expanding 500ms;
  }

  .details {
    padding: var(--spacing-3);
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
    margin: var(--spacing-3);
  }

  .square > :global(*) {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }

  .text {
    margin: 0;
    padding: var(--spacing-3);
    padding-left: 0;
    min-width: 0;
    border: 0 none;
    display: block;
    text-align: left;
    align-self: stretch;
    flex-grow: 1;
    background-color: transparent;
    position: relative;
  }

  /* The overflow:hidden on the li prevents the focus box-shadow from 
     being displayed properly, so we have to indicate focus differently here */
  .text:focus {
    box-shadow: none;
  }
  .text:focus-visible {
    box-shadow: none;
  }

  .text::after {
    content: "";
    position: absolute;
    left: 0px;
    top: 5px;
    right: 5px;
    bottom: 5px;
  }
  .text:focus::after {
    outline: none;
    /* for browsers that don't support :focus-visible */
    box-shadow: var(--focus-shadow);
  }
  .text:focus:not(:focus-visible)::after {
    /* reset style set by :focus for browsers that do supoort :focus-visible */
    box-shadow: none;
  }
  .text:focus-visible::after {
    /* for browsers that do support :focus-visible */
    box-shadow: var(--focus-shadow);
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
    padding-bottom: var(--spacing-3);
  }

  @media (hover: hover) {
    li:hover:not(.expanded) {
      background-color: var(--background-hover-list);
    }
  }

  @keyframes expanding {
    20%,
    30% {
      background-color: var(--color-hover);
    }
  }
</style>

<li class:expanded>
  <div class="alwaysVisible">
    <div class="square">
      <ShowIcon {episode} {playing} />
    </div>
    <button class="text" aria-expanded={expanded} on:click={handleClick}>
      <h2 class="episodeTitle">{episodeTitle}</h2>
      <div class="showName">{showName}</div>
    </button>
  </div>
  {#if expanded}
    <!--durations and delays below must be coordinated with the transition of
    the background-color on li -->
    <!--the reason easing.quadIn is used for in:slide is that this should make
    the user focus on the item that was just expanded because it's movement
    looks like ending a bit later this way. This is especially important when
    expanding an item that comes after the currently expanded item.-->
    <div
      class="details"
      in:slide={{ delay: 0, duration: 400, easing: delayInTransition ? quadIn : cubicOut }}
      out:slide={{ delay: 0, duration: 400 }}>
      <div class="detailsTop">
        <div>32 min left</div>
      </div>
      <div class="episodeDescription">{episodeDescription}</div>
    </div>
  {/if}
</li>
