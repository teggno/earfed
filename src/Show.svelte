<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ShowStatus } from "./userData/showTypes";

  export let show: {
    showImageUrl: string | undefined;
    showTitle: string;
    categories: string[] | undefined;
    status: ShowStatus;
  };
  $: subscribed = show.status === ShowStatus.Subscribed;
  const dispatch = createEventDispatcher();

  function handleSubscribeClick() {
    dispatch("subscribe");
  }
  function handleUnsubscribeClick() {
    dispatch("unsubscribe");
  }
</script>

{#if show.showImageUrl}
  <img src={show.showImageUrl} alt="" crossorigin="anonymous" />
{/if}
<h2>{show.showTitle}</h2>
{#if show.categories && show.categories.length}
  <ul class="categories">
    {#each show.categories as category}
      <li>{category}</li>
    {/each}
  </ul>
{/if}
{#if subscribed}
  <button on:click={handleUnsubscribeClick}>Unsubscribe</button>
{:else}<button on:click={handleSubscribeClick}>Subscribe</button>{/if}

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
