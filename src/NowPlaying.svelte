<script>
  import ArrowLeftIcon from "./icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "./icons/ArrowRightIcon.svelte";
  import DeleteIcon from "./icons/DeleteIcon.svelte";
  import PlayPauseButton from "./PlayPauseButton.svelte";
  import {
    play,
    seek,
    pause,
    playerInfo,
    playing,
    paused,
    noEpisode,
    removeEpisode,
  } from "./playerService";
  import * as bodyScroll from "./toggleBodyScroll";
  import EpisodeTimeline from "./EpisodeTimeline.svelte";
  import dragToClose from "./dragToCloseAction";

  $: disabled = $playerInfo.status === noEpisode;

  let maximized = false;
  let dragDownDistance = 0;
  let containerHeightWhenMaximized = 0;
  let textElement;

  $: draggingDown = dragDownDistance !== 0;

  function handleDragDown(e) {
    dragDownDistance += e.detail.pixels;
    if (containerHeightWhenMaximized === 0) {
      containerHeightWhenMaximized = e.target.getBoundingClientRect().height;
    }

    e.target.style.height = `${
      containerHeightWhenMaximized - dragDownDistance / 3
    }px`;
  }

  function handleDragEnd(e) {
    dragDownDistance = 0;
    e.target.style.height = null;
  }

  function handleCloseThroughDrag(e) {
    dragDownDistance = 0;
    e.target.style.height = null;

    setTimeout(() => {
      // for some reason, doing this without timeout causes some ugly jumping.
      textElement.scrollTo(0, 0);
    }, 120);

    maximized = false;
    bodyScroll.enable();
  }

  function togglePlayPause() {
    if ($playerInfo.status === playing) {
      pause();
    } else if ($playerInfo.status === paused) {
      play();
    }
  }

  function handleBack20s() {
    const currentSecond = $playerInfo.currentSecond;
    seek(currentSecond < 20 ? 0 : currentSecond - 20);
  }

  function handleForward20s() {
    const currentSecond = $playerInfo.currentSecond;
    const durationSeconds = $playerInfo.durationSeconds;
    if (typeof durationSeconds !== "number") return;

    if (currentSecond + 20 > durationSeconds) {
      pause();
    } else {
      seek(currentSecond + 20);
    }
  }

  function handleNotInterested() {
    removeEpisode();
  }

  function handleClickComponent() {
    if (maximized || disabled) return;

    dragDownDistance = 0;
    maximized = true;
    bodyScroll.disable();
  }

  function handleTimeChange({ detail: { second } }) {
    console.log(second);
    seek(second);
  }
</script>

<style>
  .container {
    position: fixed;
    width: calc(var(--app-max-width) / 2);
    height: 160px;
    min-width: 300px;
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
    overflow: hidden;
    --maximize-duration: 360ms;
  }

  .container:not(.draggingDown) {
    transition-duration: var(--maximize-duration);
    transition-timing-function: ease-out;
    transition-property: width height bottom border-radius box-shadow;
  }

  .draggingDown .text {
    overflow-y: hidden;
  }

  .container.maximized {
    width: var(--app-max-width);
    height: calc(100% - 30px);
    bottom: 0;
    border-radius: 10px 10px 0 0;
    box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.5),
      0px 24px 38px 3px rgba(0, 0, 0, 0.44),
      0px 9px 46px 8px rgba(0, 0, 0, 0.42);
  }

  .text {
    overflow-y: auto;
    padding: 0 var(--spacing-4);
  }

  :not(.maximized) .text {
    overflow-y: hidden;
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
    word-break: break-all;
  }

  .episodeDescription,
  .timeline {
    opacity: 0;
    transition: opacity 360ms;
  }

  .maximized .episodeDescription,
  .maximized .timeline {
    transition: opacity 200ms var(--maximize-duration);
    opacity: 1;
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

  .maximized .buttons > :global(*) {
    width: 33%;
  }

  .maximized .delete-wrapper {
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
  class={`container${maximized ? ' maximized' : ''}${draggingDown ? ' draggingDown' : ''}`}
  use:dragToClose
  on:click={handleClickComponent}
  on:dragdown|stopPropagation={maximized ? handleDragDown : undefined}
  on:dragend|stopPropagation={maximized ? handleDragEnd : undefined}
  on:closethroughdrag|stopPropagation={maximized ? handleCloseThroughDrag : undefined}>
  <div class="text" bind:this={textElement}>
    <div class="showName">{$playerInfo.episode?.showName || ''}</div>
    <h2 class="episodeTitle">{$playerInfo.episode?.episodeTitle || ''}</h2>
    <p class="episodeDescription">
      {$playerInfo.episode?.episodeDescription || ''}
    </p>
  </div>
  <div class="timeline">
    <EpisodeTimeline
      durationSeconds={$playerInfo.durationSeconds}
      currentSecond={$playerInfo.currentSecond}
      on:change={handleTimeChange} />
  </div>
  <div class="buttons">
    <!--NOTE about ontouchstart="" below: This is a hack because otherwise Safari on
iOS won't make nice with the :active pseudoclass.-->
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
        status={$playerInfo.status === noEpisode ? 'disabled' : $playerInfo.status}
        backgroundImageUrl={$playerInfo.episode ? $playerInfo.episode.showIconUrl : ''} />
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
      body,
      html {
        /* Prevent pull-to-refresh and "glow" effect below address bar while dragging down */
        overscroll-behavior-y: none;
      }
    </style>
  {/if}
</svelte:head>
