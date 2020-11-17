<script>
  import { writable } from "svelte/store";

  import link from "./routing/linkAction";
  export let text = "";
  export let path = "";
  export let isActive = undefined; // optional

  const active = writable(false);
</script>

<style>
  button {
    border: 0 none;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-2);
    background-color: transparent;
    margin: 0;
    transition: transform 0.2s ease-out;
    justify-content: space-between;
  }

  .active {
    color: var(--color-selected);
  }
  .active :global(svg) {
    fill: var(--color-selected);
  }

  .text {
    font-size: var(--font-size-tiny);
    padding-top: var(--spacing-2);
    font-weight: 600;
  }
</style>

<button
  type="button"
  class={$active ? 'active' : ''}
  disabled={$active}
  on:click
  use:link={{ path, active, isActive }}>
  <slot />
  <span class="text">{text}</span>
</button>
