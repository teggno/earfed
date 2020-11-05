<script>
  import { getAnimationTargetRect } from "./animationTargetRect";

  import AnimatedPlayToPauseIcon from "./icons/AnimatedPlayToPauseIcon.svelte";
  import PauseIcon from "./icons/PauseIcon.svelte";

  import PlayIcon from "./icons/PlayIcon.svelte";
  import { pause, play } from "./playerService";

  export let episode;
  export let playing = false;

  const playButtonRect = getAnimationTargetRect();

  const moveAvgSpeed = 0.3;
  const playIconStartSize = 36;

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
    if (!playing) {
      play(episode);
      if (animationStatus === "notRunning") {
        animatePlay();
      }
    } else {
      pause();
    }
  }

  function animatePlay() {
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
    --button-animation-property: transform;
    --button-animation-timing: ease-in-out;
    --button-down-duration: 120ms;
    --button-release-duration: 400ms;

    background-color: orange;
    font-size: 0;
    margin: 0;
    padding: 0;
    border: 0 none;
    background-repeat: no-repeat;
    background-size: contain;
  }

  button:active {
    transform: scale(0.95);
    outline: 0;
  }

  button > * {
    z-index: 2;
    position: relative;
  }

  button,
  button::after {
    border-radius: var(--spacing-2);
  }

  .playIconWrapper {
    display: inline-block;
  }

  .playIconWrapper :global(svg) {
    stroke: gray;
    fill: #eee;
    stroke-width: 0.75;
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
    stroke-width: 0.75;
    animation: color forwards var(--duration);
  }

  /* semitransparent overlay when button is pressed */
  button::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
    opacity: 0;
    z-index: 2;
  }

  button:active:after {
    opacity: 1;
  }

  /* button press/release transition */
  button,
  button::after {
    transition-property: var(--button-animation-property);
    transition-timing-function: var(--button-animation-timing);
    transition-duration: var(--button-release-duration);
  }

  button:active,
  button:active:after {
    transition-duration: var(--button-down-duration);
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

  @keyframes color {
    0% {
      fill: #eee;
      stroke: gray;
      stroke-width: 0.75;
    }
    10% {
      fill: #eee;
      stroke: gray;
      stroke-width: 0.25;
    }
    40% {
      stroke-width: 0;
    }
    50% {
      stroke-width: 0;
      fill: black;
      stroke: black;
    }
    80% {
      stroke-width: 0;
    }
    100% {
      stroke-width: 0.75;
      fill: #eee;
      stroke: gray;
    }
  }
</style>

<button
  ontouchstart=""
  class={`${episode.showIconUrl ? '' : 'noIcon'}`}
  style={`--show-name-first-letter:'${episode.showName.substr(0, 1)}';--start-size:${playIconStartSize}px;${episode.showIconUrl ? `background-image:url('${episode.showIconUrl}')` : ''}`}
  on:click={handleClick}>
  <span class="playIconWrapper" bind:this={playIconWrapper}>
    {#if playing}
      <PauseIcon />
    {:else}
      <PlayIcon />
    {/if}
  </span>
</button>

{#if animationVisible}
  <div class="playAnimation" style={`${animationVars}${animationPositionCss}`}>
    <AnimatedPlayToPauseIcon {durationMillis} />
  </div>
{/if}

<svelte:window on:scroll={handleWindowScroll} />
