<script>
    import AddEpisodeToQueueIcon from "./icons/AddEpisodeToQueueIcon.svelte";
    import EpisodeAddedToPlaylistIcon from "./icons/EpisodeAddedToPlaylistIcon.svelte";

    export let queued;
</script>

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

{#if queued}
    <div class="added">
        <EpisodeAddedToPlaylistIcon />
    </div>
{:else}
    <button on:click title="Add to Queue" on:touchstart|passive>
        <AddEpisodeToQueueIcon />
    </button>
{/if}
