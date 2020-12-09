<script>
  import { showImageUrlThumb } from "./config";

  export let show;
</script>

<style>
  .categories {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .categories li {
    display: inline-block;
    padding: 0 var(--spacing-2);
  }
</style>

<img
  src={showImageUrlThumb(show.showImageUrl)}
  alt=""
  crossorigin="anonymous" />
<h2>{show.showTitle}</h2>
{#if show.categories && show.categories.length}
  <ul class="categories">
    {#each show.categories as category}
      <li>{category}</li>
    {/each}
  </ul>
{/if}
