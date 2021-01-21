<script>
  import { createEventDispatcher } from "svelte";
  import SearchIcon from "../icons/SearchIcon.svelte";
  import { fade } from "svelte/transition";

  export let searchText = "";

  const dispatch = createEventDispatcher();

  let focused = false;
  $: buttonDisabled = !searchText;
  $: buttonVisible = searchText || focused;

  function handleSubmit(e) {
    e.preventDefault();

    e.target.querySelector("input[type='search']").blur();

    if (searchText && searchText.trim()) {
      dispatch("search", { searchText });
    }
  }

  function handleTouchStart(e) {
    e.target.select();
    e.preventDefault();
  }

  function handleFocus() {
    focused = true;
  }

  function handleBlur() {
    focused = false;
  }
</script>

<form on:submit={handleSubmit}>
  <div class="fieldWrapper" class:focused class:buttonVisible>
    <div class="searchIconWrapper">
      <SearchIcon />
    </div>
    <input
      id="searchField"
      aria-label="Enter Search Text"
      placeholder="Podcast or Episode"
      type="search"
      spellcheck={false}
      autocorrect="off"
      autocomplete="off"
      autocapitalize="off"
      on:touchstart={handleTouchStart}
      on:focus={handleFocus}
      on:blur={handleBlur}
      bind:value={searchText}
    />
    {#if buttonVisible}
      <button transition:fade title="Search" disabled={buttonDisabled}
        ><SearchIcon title="Search" /></button
      >
    {/if}
  </div>
</form>

<style>
  .fieldWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0 0 var(--input-padding);
    border: var(--input-border);
    border-radius: var(--input-border-radius);
    background: var(--color-input-background);
    position: relative;

    --font-size: var(--font-size-medium);
    --left-icon-size: calc(var(--assumed-normal-lh) * var(--font-size));
    --height: calc(var(--assumed-normal-lh) * var(--font-size-large));
    --button-width: calc(var(--height) + var(--input-padding));
  }

  input {
    flex-grow: 1;
    flex-shrink: 0;
    border: 0;
    margin: var(--input-padding);
    padding: 0;
    background: transparent;
    align-self: stretch;
    height: var(--height);
    font-size: var(--font-size);
    z-index: 2;
  }

  input:focus,
  input:focus-visible {
    /*remove focus indication because it mus be given to .fieldWrapper */
    box-shadow: none;
  }

  .buttonVisible input {
    padding: 0 var(--button-width) 0 0;
  }

  .searchIconWrapper {
    display: flex;
    justify-content: center;
    height: var(--left-icon-size);
    width: var(--left-icon-size);
    transition: all 0.4s;
  }

  .searchIconWrapper :global(svg) {
    width: 100%;
    height: 100%;
    fill: var(--color-input-placeholder);
  }
  .focused .searchIconWrapper {
    width: 0;
    height: 0;
  }

  button {
    border: 0 none;
    background-color: transparent;
    display: flex;
    padding: var(--input-padding);
    position: absolute;
    right: 0;
    top: 0;
  }
  button :global(svg) {
    width: var(--height);
    height: var(--height);
    fill: var(--color-accent);
  }

  button:disabled {
    z-index: 1;
  }

  button:disabled :global(svg) {
    width: var(--height);
    height: var(--height);
    fill: var(--color-disabled);
  }
</style>
