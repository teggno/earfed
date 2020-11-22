<script>
  import sanitizeHtml from "./html/sanitizeHtml";
  export let episodeDescription = { type: "text", value: "" };
</script>

<style>
  .root {
    line-height: var(--lh-copy);
  }

  .root :global(ul) {
    list-style-type: disc;
  }

  .root :global(ul) :global(ul) {
    list-style-type: circle;
  }

  .root :global(ul) :global(ul) :global(ul) {
    list-style-type: square;
  }
</style>

<div class="root">
  {#if episodeDescription.type === 'text'}
    episodeDescription.value
  {:else}
    <!--TODO: Align h1 - h6 inside episodeDescription.value to make styling
    inside container reliable-->
    {@html sanitizeHtml(episodeDescription.value)}
  {/if}
</div>
