<script>
  import { createEventDispatcher } from "svelte";

  export let ariaExpanded = undefined;

  const dispatch = createEventDispatcher();
  function handleKeyDown(e) {
    if (e.keyCode === 13 /* enter */ || e.keyCode === 32 /* space */) {
      dispatch("click");
    }
  }
</script>

<div
  aria-expanded={ariaExpanded}
  on:click
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0">
  <slot />
</div>
