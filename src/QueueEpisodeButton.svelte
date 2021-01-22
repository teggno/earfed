<script lang="ts">
  import AddEpisodeToQueueIcon from "./icons/AddEpisodeToQueueIcon.svelte";
  import EpisodeAddedToQueueIcon from "./icons/EpisodeAddedToQueueIcon.svelte";

  export let queued: boolean;
</script>

{#if queued}
  <div class="added">
    <EpisodeAddedToQueueIcon />
  </div>
{:else}
  <button on:click title="Add to Queue" on:touchstart|passive>
    <AddEpisodeToQueueIcon />
  </button>
{/if}

<style>
  .added {
    fill: var(--color-disabled);
    padding: 10px;
  }
  button {
    border: 0 none;
    padding: 10px;
  }
  button:active {
    transform: var(--button-press-transform);
  }
</style>
