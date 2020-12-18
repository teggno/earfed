<script>
    import AddEpisodeToQueueIcon from "./icons/AddEpisodeToQueueIcon.svelte";
    import EpisodeAddedToPlaylistIcon from "./icons/EpisodeAddedToPlaylistIcon.svelte";

    export let queued;
</script>

{#if queued}
    <EpisodeAddedToPlaylistIcon />
{:else}
    <button on:click>
        <AddEpisodeToQueueIcon />
    </button>
{/if}
