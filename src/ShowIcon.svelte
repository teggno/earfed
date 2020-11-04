<script>
  import { createEventDispatcher } from "svelte";

  import { getAnimationTargetRect } from "./animationTargetRect";

  import AnimatedPlayToPauseIcon from "./icons/AnimatedPlayToPauseIcon.svelte";

  import PlayIcon from "./icons/PlayIcon.svelte";

  export let showIconUrl = "";
  export let showName = "";
  export let disabled = false;

  const playButtonRect = getAnimationTargetRect();
  const dispatch = createEventDispatcher();

  const moveAvgSpeed = 0.3;
  const playIconStartSize = 30;

  let playIconWrapper;
  let playIconWrapperRect = {};
  let animationStatus = "notRunning";
  let scrolled = false;

  $: animationVisible = animationStatus !== "notRunning" && !scrolled;

  $: animationPositionCss =
    animationStatus === "notRunning"
      ? ""
      : animationStatus === "entering"
      ? `left:${playIconWrapperRect.left}px;top:${playIconWrapperRect.top}px;`
      : `left:${$playButtonRect.left}px;top:${$playButtonRect.top}px;`;

  $: moveDistance = Math.sqrt(
    Math.pow($playButtonRect.left - playIconWrapperRect.left, 2) +
      Math.pow($playButtonRect.top - playIconWrapperRect.top, 2)
  );

  $: durationMillis = moveDistance / moveAvgSpeed;

  $: animationVars = `
  --start-size:${playIconStartSize}px;
  --middle-size:${3 * $playButtonRect.width}px;
  --end-size:${$playButtonRect.width}px;
  --duration:${durationMillis}ms;`;

  function handleClick() {
    dispatch("click");
    if (animationStatus !== "notRunning") return;
    playIconWrapperRect = playIconWrapper.getBoundingClientRect();
    animationStatus = "entering";
    scrolled = false;
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        animationStatus = "notRunning";
      }, durationMillis);
      window.requestAnimationFrame(() => {
        animationStatus = "running";
      });
    });
  }

  function handleWindowScroll() {
    scrolled = true;
  }
</script>

<style>
  button {
    background-color: bisque;
    font-size: 0;
    margin: 0;
    padding: 0;
    border: 0 none;
    background-repeat: no-repeat;
    background-size: contain;
  }

  button > * {
    z-index: 2;
    position: relative;
  }

  /* 
   This displays the placeholder (background and first letter of show name) 
   in case there is no show icon
   */
  button.noIcon::before {
    content: var(--show-name-first-letter);
    background-color: yellowgreen;
    color: white;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: var(--font-size-large);
    z-index: 1;
  }

  button,
  button.noIcon::before {
    border-radius: var(--spacing-2);
  }

  .playIconWrapper {
    display: inline-block;
  }

  .playIconWrapper :global(svg) {
    stroke: whitesmoke;
    fill: #666;
    stroke-width: 1;
    width: var(--start-size);
    height: var(--start-size);
  }

  .playAnimation {
    position: fixed;
    display: inline-block;
    z-index: 10;
    transition: all ease var(--duration);
    animation: size forwards var(--duration);
  }

  .playAnimation :global(svg) {
    width: 100%;
    height: 100%;
    stroke-width: 1;
    stroke: white;
  }

  @keyframes size {
    0% {
      width: var(--start-size);
      height: var(--start-size);
    }
    30% {
      width: var(--middle-size);
      height: var(--middle-size);
    }
    100% {
      width: var(--end-size);
      height: var(--end-size);
    }
  }
</style>

<button
  {disabled}
  class={`${showIconUrl ? '' : 'noIcon'}`}
  style={`--show-name-first-letter:'${showName.substr(0, 1)}';--start-size:${playIconStartSize}px;${showIconUrl ? `background-image:url('${showIconUrl}')` : ''}`}
  on:click={handleClick}>
  <span class="playIconWrapper" bind:this={playIconWrapper}>
    <PlayIcon />
  </span>
</button>

{#if animationVisible}
  <div class="playAnimation" style={`${animationVars}${animationPositionCss}`}>
    <AnimatedPlayToPauseIcon {durationMillis} />
  </div>
{/if}

<svelte:window on:scroll={handleWindowScroll} />
