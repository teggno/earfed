<script lang="ts">
  import PauseIcon from "../icons/PauseIcon.svelte";
  import PlayIcon from "../icons/PlayIcon.svelte";
  import { fade } from "svelte/transition";
  import * as easing from "svelte/easing";
  import { createEventDispatcher, onMount } from "svelte";
  import { hitTest } from "../dom/hitTest";
  import { animationTargetRectSetterFactory } from "../animationTargetRect";
  import { ButtonStatus } from "./nowPlayingTypes";

  export let status: ButtonStatus = ButtonStatus.Disabled;
  export let backgroundImageUrl = "";

  const setAnimationTargetRect = animationTargetRectSetterFactory();
  onMount(() => {
    updateRectInStore();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });
  const dispatch = createEventDispatcher();
  const hitTestTolerance = 20;
  let button;

  function handleWindowResize() {
    updateRectInStore();
  }
  function updateRectInStore() {
    const r = button.getBoundingClientRect();
    const v = {
      left: r.left + 8,
      top: r.top + 8,
      width: r.width - 16,
      height: r.height - 16,
    };
    setAnimationTargetRect(v);
  }

  // We could just have used :active in CSS. But this can get inconsistent with the
  // icon displayed. E.g. when the user drags while the button is down, it comes up by
  // itself and then, only when the button is released (mouse/touch up), the icon gets changed.
  let buttonDown = false;

  function handleTouchStart() {
    if (status === ButtonStatus.Disabled) return;
    buttonDown = true;
  }

  function handleTouchEnd(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
    buttonUp();
    for (var i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (hitTest(touch.clientX, touch.clientY, e.target, hitTestTolerance)) {
        dispatch("toggle");
        return;
      }
    }
  }

  function handleMouseDown(e) {
    if (e.button !== 0) return;
    buttonDown = true;
  }

  function handleMouseUp(e) {
    if (!buttonDown) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    buttonUp();
    if (hitTest(e.clientX, e.clientY, button, hitTestTolerance)) {
      dispatch("toggle");
      return;
    }
  }

  function handleContextMenu(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }

  function buttonUp() {
    setTimeout(() => {
      buttonDown = false;
    }, 120);
  }
</script>

<style>
  button {
    border: 0 none;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    position: relative;
    margin: 0;
    padding: 0;
    transition: transform 120ms ease-in-out;
    font-size: 0;
    overflow: hidden;
  }

  button:disabled {
    color: var(--color-disabled);
  }

  button:disabled :global(svg) {
    fill: var(--color-disabled);
    stroke: var(--color-disabled);
  }

  button.buttonDown {
    transform: scale(0.85);
    outline: 0;
  }

  button::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    opacity: 0;
    transition: opacity 400ms ease-in-out;
  }

  button.buttonDown::after {
    opacity: 1;
    transition: opacity 120ms ease-in-out;
  }

  .showImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .icon :global(svg) {
    stroke: gray;
    fill: #eee;
    stroke-width: 0.75;
    width: 48px;
    height: 48px;
  }
</style>

<button
  on:touchstart={handleTouchStart}
  on:touchend={handleTouchEnd}
  on:mousedown={handleMouseDown}
  on:contextmenu={handleContextMenu}
  bind:this={button}
  class:buttonDown
  on:click|stopPropagation
  disabled={status === ButtonStatus.Disabled}
  title={ButtonStatus.Playing ? 'Pause' : 'Play'}>
  {#if backgroundImageUrl}
    <img
      src={backgroundImageUrl}
      alt=""
      class="showImage"
      crossorigin="anonymous" />
  {/if}
  {#if status === ButtonStatus.Playing}
    <span
      class="icon"
      in:fade={{ duration: 240, delay: 60, easing: easing.expoOut }}>
      <PauseIcon />
    </span>
  {:else}
    <span
      class="icon"
      in:fade={{ duration: 240, delay: 60, easing: easing.expoOut }}>
      <PlayIcon />
    </span>
  {/if}
</button>

<svelte:window on:mouseup={handleMouseUp} />
