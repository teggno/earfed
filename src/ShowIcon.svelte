<script>
  import PlayAnimation from "./icons/PlayAnimation.svelte";

  import PlayIcon from "./icons/PlayIcon.svelte";

  export let showIconUrl = "";
  export let showName = "";
  export let playButtonRect;

  let height = 0;
  let wrapper;
  let wrapperRect = {};
  const moveAvgSpeed = 0.3;

  let animationStatus = "notRunning";

  $: animationVisible = animationStatus !== "notRunning";

  $: animationPositionCss =
    animationStatus === "notRunning"
      ? ""
      : animationStatus === "entering"
      ? `${getWrapperPositionCss()}width:30px;height:30px;`
      : `left:${$playButtonRect.left}px;top:${
          $playButtonRect.top + window.scrollY
        }px;width:${$playButtonRect.width}px;height:${
          $playButtonRect.height
        }px;`;

  $: moveDistance = Math.sqrt(
    Math.pow($playButtonRect.left - wrapperRect.left, 2) +
      Math.pow($playButtonRect.top - wrapperRect.top, 2)
  );

  $: moveMillis = moveDistance / moveAvgSpeed;

  function handleClick(e) {
    wrapperRect = wrapper.getBoundingClientRect();
    animationStatus = "entering";
    // console.log(getWrapperPositionCss());
    // console.log(window.scrollY);
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        animationStatus = "notRunning";
      }, moveMillis);
      window.requestAnimationFrame(() => {
        animationStatus = "running";
      });
    });
  }

  function getWrapperPositionCss() {
    if (!wrapperRect) return "";
    return `left:${wrapperRect.left}px;top:${
      wrapperRect.top + window.scrollY
    }px;`;
  }
</script>

<style>
  .wrapper {
    background-color: bisque;
    position: relative;
    padding: 0;
    border: 0 none;
    margin: 0;
  }

  img,
  .placeholder {
    border-radius: var(--spacing-2);
  }

  .placeholder {
    background-color: yellowgreen;
    color: rgba(255, 255, 255, 0.6);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: var(--font-size-large);
  }

  .playIconWrapper {
    position: absolute;
    font-size: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .playIconWrapper :global(svg) {
    stroke: whitesmoke;
    fill: #666;
    stroke-width: 1;
    width: 30px;
    height: 30px;
  }

  .playAnimation {
    position: absolute;
    display: inline-block;
    z-index: 10;
    transition: all ease;
  }

  .playAnimation :global(svg) {
    width: 100%;
    height: 100%;
    stroke-width: 1;
    stroke: white;
  }
</style>

<button
  class="wrapper"
  bind:offsetHeight={height}
  style={`width:${height}px`}
  on:click={handleClick}>
  {#if showIconUrl}
    <img src={showIconUrl} alt="" />
  {:else}
    <span class="placeholder">
      {showName ? showName.substr(0, 1).toUpperCase() : ''}
    </span>
  {/if}
  <span class="playIconWrapper" bind:this={wrapper}>
    <PlayIcon />
  </span>
</button>

{#if animationVisible}
  <div
    class="playAnimation"
    style={`${animationPositionCss}transition-duration:${moveMillis}ms`}>
    <PlayAnimation durationMillis={moveMillis} />
  </div>
{/if}
