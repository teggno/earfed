<script>
  import { slide } from "svelte/transition";
  import { circIn, cubicOut, quadIn } from "svelte/easing";

  import ShowIcon from "./ShowIcon.svelte";
  import EpisodeDescription from "./EpisodeDescription.svelte";
  import DragHandleIcon from "../icons/DragHandleIcon.svelte";
  import { createEventDispatcher } from "svelte";
  import { formatDate } from "../dates";

  export let episode;
  export let playing = false;
  export let expanded = false;
  export let delayInTransition = false;
  export let dragHandleVisible = false;

  let li;
  const dispatch = createEventDispatcher();

  const { showTitle, episodeTitle, episodeDescription, pubDate } = episode;

  function handleExpandClick() {
    dispatch("click", { li });
  }
</script>

<style>
  li {
    overflow: hidden;
    padding: var(--spacing-2) 0;
    /* 400ms must be coordinated with the slide animation below */
    transition: background-color ease-out 400ms, border-width 100ms;
  }

  li.expanded {
    background-color: #f9f9f9;
  }

  .alwaysVisible {
    display: flex;
    align-items: center;
    --square-size: max(
      calc(
        2 * var(--assumed-normal-lh) * var(--font-size-small) +
          var(--assumed-normal-lh) * var(--font-size-small) + var(--spacing-2) *
          2
      ),
      44px
    );
  }

  .alwaysVisible :global(:first-child) {
    flex-shrink: 0;
  }

  li.expanded .alwaysVisible {
    animation: expanding 500ms;
  }

  .alwaysVisible > :global(:first-child) {
    width: var(--square-size);
    height: var(--square-size);
  }

  .rightOfImage {
    position: relative;
    padding: var(--spacing-2);
    padding-left: 0;
    margin-left: var(--spacing-2);
    min-width: 0;
    background-color: transparent;
    border: 0 none;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex-grow: 1;
    align-self: stretch;
  }

  /* The overflow:hidden on the li prevents the focus box-shadow from 
     being displayed properly, so we have to indicate focus differently here */
  .rightOfImage:focus {
    box-shadow: none;
  }
  .rightOfImage:focus-visible {
    box-shadow: none;
  }

  .rightOfImage::after {
    content: "";
    position: absolute;
    left: 0px;
    top: 5px;
    right: 5px;
    bottom: 5px;
  }
  .rightOfImage:focus::after {
    outline: none;
    /* for browsers that don't support :focus-visible */
    box-shadow: var(--focus-shadow);
  }
  .rightOfImage:focus:not(:focus-visible)::after {
    /* reset style set by :focus for browsers that do supoort :focus-visible */
    box-shadow: none;
  }
  .rightOfImage:focus-visible::after {
    /* for browsers that do support :focus-visible */
    box-shadow: var(--focus-shadow);
  }

  .episodeTitle {
    padding: 0;
    font-size: var(--font-size-small);
    font-weight: 500;
    text-align: left;
    max-width: 100%;
    overflow: hidden;
    /* two lines of text */
    max-height: calc(var(--font-size-small) * var(--assumed-normal-lh) * 2);
  }

  .showTitle {
    color: var(--color-text-muted-little);
    font-size: var(--font-size-small);
    text-align: left;
    max-width: 100%;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .episodeDescription {
    padding: var(--spacing-3);
  }

  .detailsTop {
    padding: var(--spacing-3);
  }

  .dragHandle {
    flex-shrink: 0;
    padding-right: var(--spacing-3);
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

<li class:expanded bind:this={li}>
  <article>
    <div class="alwaysVisible pointer">
      <ShowIcon {episode} {playing} />
      <button
        class="rightOfImage"
        on:click={handleExpandClick}
        ariaExpanded={expanded}>
        <span class="episodeTitle">{episodeTitle}</span>
        <span class="showTitle">{!!pubDate && formatDate(pubDate)}
          &#149;
          {showTitle}</span>
      </button>
      {#if dragHandleVisible}
        <div class="dragHandle">
          <DragHandleIcon />
        </div>
      {/if}
    </div>
    {#if expanded}
      <!--durations and delays below must be coordinated with the transition of
    the background-color on li -->
      <!--the reason easing.quadIn is used for in:slide is that this should make
    the user focus on the item that was just expanded because it's movement
    looks like ending a bit later this way. This is especially important when
    expanding an item that is below the currently expanded item.-->
      <div
        class="details"
        in:slide={{ delay: 0, duration: episodeDescription.value ? Math.max(episodeDescription.value.length / 13, 400) : 400, easing: delayInTransition ? quadIn : circIn }}
        out:slide={{ delay: 0, duration: 400, easing: cubicOut }}>
        <div class="detailsTop">
          <div>
            {episode.positionSeconds && episode.positionSeconds.value ? `${Math.round((episode.durationSeconds - episode.positionSeconds.value) / 60)} min left` : `${Math.round(episode.durationSeconds / 60)} min`}
          </div>
        </div>
        <section class="episodeDescription">
          <EpisodeDescription {episodeDescription} />
        </section>
      </div>
    {/if}
  </article>
</li>
