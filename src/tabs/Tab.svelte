<script lang="ts">
  export let selected = false;
  export let disabled = false;
</script>

<button
  class="root"
  class:selected
  on:click
  {disabled}
  role="tab"
  aria-selected={selected}>
  <slot />
</button>

<style>
  .root {
    flex-grow: 1;
    text-align: center;
    border: 0 none;
    padding: var(--spacing-3) 0;
    background-color: transparent;
  }

  .root:disabled {
    color: var(--color-disabled);
  }
</style>
