<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { circIn, cubicOut, quadIn } from "svelte/easing";

  import ShowIcon from "./ShowIcon.svelte";
  import DivButton from "./DivButton.svelte";
  import EpisodeDescription from "./EpisodeDescription.svelte";

  export let episode;
  export let playing = false;
  export let expanded = false;
  export let delayInTransition = false;

  const { showTitle, episodeTitle, episodeDescription } = episode;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("toggleExpanded");
  }
</script>

<style>
  li {
    overflow: hidden;
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

  .alwaysVisible {
    --square-size: max(
      calc(
        var(--assumed-normal-lh) * var(--font-size-medium) +
          var(--assumed-normal-lh) * var(--font-size-small) + var(--spacing-1)
      ),
      44px
    );
  }

  .alwaysVisible > :global(:first-child) {
    margin: var(--spacing-3);
    width: var(--square-size);
    height: var(--square-size);
  }

  .alwaysVisible > :global(.divButton) {
    padding: var(--spacing-3);
    padding-left: 0;
    min-width: 0;
    align-self: stretch;
    flex-grow: 1;
    background-color: transparent;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* The overflow:hidden on the li prevents the focus box-shadow from 
     being displayed properly, so we have to indicate focus differently here */
  .alwaysVisible > :global(.divButton):focus {
    box-shadow: none;
  }
  .alwaysVisible > :global(.divButton):focus-visible {
    box-shadow: none;
  }

  .alwaysVisible > :global(.divButton)::after {
    content: "";
    position: absolute;
    left: 0px;
    top: 5px;
    right: 5px;
    bottom: 5px;
  }
  .alwaysVisible > :global(.divButton):focus::after {
    outline: none;
    /* for browsers that don't support :focus-visible */
    box-shadow: var(--focus-shadow);
  }
  .alwaysVisible > :global(.divButton):focus:not(:focus-visible)::after {
    /* reset style set by :focus for browsers that do supoort :focus-visible */
    box-shadow: none;
  }
  .alwaysVisible > :global(.divButton):focus-visible::after {
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

  .showTitle {
    font-size: var(--font-size-small);
    color: var(--color-text-muted);
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
  <article>
    <div class="alwaysVisible pointer">
      <ShowIcon {episode} {playing} />
      <DivButton
        on:click={handleClick}
        ariaExpanded={expanded}
        className="divButton">
        <h2 class="episodeTitle">{episodeTitle}</h2>
        <div class="showTitle">{showTitle}</div>
      </DivButton>
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
