<script>
  import ArrowLeftIcon from "./icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "./icons/ArrowRightIcon.svelte";
  import DeleteIcon from "./icons/DeleteIcon.svelte";
  import PlayPauseButton from "./PlayPauseButton.svelte";
  import {
    play,
    pause,
    playerInfo,
    playing,
    paused,
    noEpisode,
    removeEpisode,
  } from "./playerService";
  import dragDownDetectorFactory from "./dragDownDetector";
  import { fade } from "svelte/transition";
  import * as bodyScroll from "./toggleBodyScroll";
  import EpisodeTimeline from "./EpisodeTimeline.svelte";

  $: disabled = $playerInfo.status === noEpisode;

  let maximized = false;

  const maximizedFadeOptions = { delay: 400, duration: 200 };

  const dragDownDetector = dragDownDetectorFactory(() => {
    maximized = false;
    bodyScroll.enable();
  });

  function togglePlayPause() {
    if ($playerInfo.status === playing) {
      pause();
    } else if ($playerInfo.status === paused) {
      play();
    }
  }

  function handleBack20s() {}

  function handleForward20s() {}

  function handleNotInterested() {
    removeEpisode();
  }

  function handleClickComponent() {
    if (maximized) return;

    maximized = true;
    bodyScroll.disable();
  }
</script>

<style>
  .container {
    width: calc(var(--app-max-width) / 2);
    min-width: 300px;
    height: 160px;
    position: fixed;
    bottom: 150px;
    right: calc(50% - var(--app-max-width) / 2);
    border-radius: 50px 0 0 50px;
    padding: var(--spacing-4) 0;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /*copied from material UI dialog*/
    box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
      0px 24px 38px 3px rgba(0, 0, 0, 0.14),
      0px 9px 46px 8px rgba(0, 0, 0, 0.12);
    z-index: 6;
    transition: all 400ms ease 50ms;
    overflow: hidden;
  }

  .container.maximized {
    bottom: 0;
    width: var(--app-max-width);
    box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.5),
      0px 24px 38px 3px rgba(0, 0, 0, 0.44),
      0px 9px 46px 8px rgba(0, 0, 0, 0.42);
    border-radius: 10px 10px 0 0;
    height: calc(100% - 30px);
  }

  .text {
    overflow-y: auto;
    padding: 0 var(--spacing-4);
  }

  .showName {
    font-size: var(--font-size-small);
    padding-left: var(--spacing-3);
    color: var(--color-text-muted);
    text-align: center;
  }

  .episodeTitle {
    margin: var(--spacing-1) 0 0 0;
    padding: 0;
    font-weight: normal;
    font-size: var(--font-size-medium);
    text-align: center;
  }

  .showName,
  .episodeTitle {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .episodeDescription {
    font-size: var(--font-size-small);
    line-height: var(--lh-copy);
    margin: var(--spacing-3) 0 0 0;
  }

  .text,
  .timeline {
    flex-shrink: 1;
    transition: all 400ms 50ms;
  }
  .timeline {
    flex-basis: 0;
    overflow-y: hidden;
  }
  .maximized .text,
  .maximized .timeline {
    flex-basis: auto;
    margin-bottom: var(--spacing-4);
  }

  .maximized .text {
    flex-shrink: 2;
  }
  .maximized .timeline {
    flex-shrink: 0.1;
  }

  .timeline,
  .buttons {
    padding: 0 var(--spacing-4);
  }

  .buttons {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .buttons > :global(*) {
    display: inline-block;
    overflow: hidden;
    width: calc(25% - 16px / 3);
    text-align: center;
    transition: all 400ms;
  }

  .play-pause-wrapper {
    width: calc(25% + 16px);
  }
  .buttons.maximized > :global(*) {
    width: 33%;
  }

  .maximized > .delete-wrapper {
    opacity: 0;
    width: 0;
  }

  button:disabled {
    color: var(--color-disabled);
    fill: var(--color-disabled);
  }

  .navButton {
    background-color: whitesmoke;
    border-radius: 50%;
    border: 0 none;
    padding: 0;
    margin: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: var(--font-size-small);
    width: 48px;
    height: 48px;
    transition: transform 120ms ease-in-out;
  }

  .navButton:not(:disabled):active {
    transform: scale(0.85);
  }
</style>

<div
  class={`container${maximized ? ' maximized' : ''}`}
  on:click={handleClickComponent}
  on:touchstart|stopPropagation={maximized ? dragDownDetector.handleTouchStart : undefined}
  on:touchmove|stopPropagation={maximized ? dragDownDetector.handleTouchMove : undefined}
  on:touchend|stopPropagation={maximized ? dragDownDetector.handleTouchEnd : undefined}>
  <div class="text">
    <div class="showName">{$playerInfo.episode?.showName || ''}</div>
    <h2 class="episodeTitle">{$playerInfo.episode?.episodeTitle || ''}</h2>
    {#if maximized}
      <p class="episodeDescription" in:fade={maximizedFadeOptions}>
        What happens when an open-source experiment becomes software people care
        about? Carl and Richard talk to Jamie Rees about his experiences
        creating Ombi - an open-source project that helps people managing Plex
        servers to handle requests from friends and family for more content.
        Jamie talks about creating Ombi as an experiment with NancyFX that soon
        evolved into something lots of folks needed and wanted. The conversation
        dives into the challenges of managing a popular open-source project,
        both from a technical, personal, and professional perspective. What
        happens when an open-source experiment becomes software people care
        about? Carl and Richard talk to Jamie Rees about his experiences
        creating Ombi - an open-source project that helps people managing Plex
        servers to handle requests from friends and family for more content.
        Jamie talks about creating Ombi as an experiment with NancyFX that soon
        evolved into something lots of folks needed and wanted. The conversation
        dives into the challenges of managing a popular open-source project,
        both from a technical, personal, and professional perspective. What
        happens when an open-source experiment becomes software people care
        about? Carl and Richard talk to Jamie Rees about his experiences
        creating Ombi - an open-source project that helps people managing Plex
        servers to handle requests from friends and family for more content.
        Jamie talks about creating Ombi as an experiment with NancyFX that soon
        evolved into something lots of folks needed and wanted. The conversation
        dives into the challenges of managing a popular open-source project,
        both from a technical, personal, and professional perspective.
      </p>
    {/if}
  </div>
  <!--NOTE about ontouchstart="" below: This is a hack because otherwise Safari on
iOS won't make nice with the :active pseudoclass.-->

  {#if maximized}
    <div class="timeline" in:fade={maximizedFadeOptions}>
      <EpisodeTimeline durationSeconds={48 * 60} currentSecond={0} />
    </div>
  {/if}
  <div class={`buttons${maximized ? ' maximized' : ''}`}>
    <span>
      <button
        class="navButton"
        on:click|stopPropagation={handleBack20s}
        ontouchstart=""
        {disabled}>
        <span>-20s</span>
        <ArrowLeftIcon />
      </button>
    </span>
    <span class="play-pause-wrapper">
      <PlayPauseButton
        on:toggle={togglePlayPause}
        status={$playerInfo.status === noEpisode ? 'disabled' : $playerInfo.status} />
    </span>
    <span>
      <button
        class="navButton"
        on:click|stopPropagation={handleForward20s}
        ontouchstart=""
        {disabled}>
        <span>+20s</span>
        <ArrowRightIcon />
      </button>
    </span>
    <span class="delete-wrapper">
      <button
        class="navButton"
        on:click|stopPropagation={handleNotInterested}
        ontouchstart=""
        {disabled}>
        <DeleteIcon />
      </button>
    </span>
  </div>
</div>

<svelte:head>
  {#if maximized}
    <style>
      body {
        /* Prevent "glow" effect below address bar while dragging down */
        overscroll-behavior-y: none;
      }
    </style>
  {/if}
</svelte:head>
