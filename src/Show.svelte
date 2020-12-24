<script>
  import { createEventDispatcher } from "svelte";

  import { showImageUrlThumb } from "./config";

  export let show;

  const dispatch = createEventDispatcher();

  function handleSubscribeClick() {
    dispatch("subscribe");
  }
  function handleUnsubscribeClick() {
    dispatch("unsubscribe");
  }
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
{#if show.subscribed}
  <button on:click={handleUnsubscribeClick}>Unsubscribe</button>
{:else}<button on:click={handleSubscribeClick}>Subscribe</button>{/if}
