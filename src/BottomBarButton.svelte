<script>
  export let text = "";
  export let selected = false;
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

  /* button:not(:disabled):active {
    background-color: rgba(255, 255, 255);
    opacity: 0.6;
    transform: translateY(1px);
  } */

  .selected {
    color: var(--color-selected);
  }
  .selected :global(svg) {
    fill: var(--color-selected);
  }

  .text {
    font-size: var(--font-size-tiny);
    padding-top: var(--spacing-2);
    font-weight: 600;
  }
</style>

<button type="button" class:selected disabled={selected} on:click>
  <slot />
  <span class="text">{text}</span>
</button>
