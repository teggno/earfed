<script>
  export let src;
  export let alt = "";
  export let crossorigin = undefined;

  let error = false;

  function handleImageError() {
    error = true;
  }
</script>

<style>
  .fallback {
    background-color: var(--image-fallback-color);
  }
</style>

{#if error}
  <slot>
    <div class="fallback" />
  </slot>
{:else}<img {src} {alt} on:error={handleImageError} {crossorigin} />{/if}
