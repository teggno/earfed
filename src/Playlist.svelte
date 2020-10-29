<script>
  import PageTitle from "./PageTitle.svelte";
  import PlaylistItem from "./PlaylistItem.svelte";

  export let episodes = [];
  export let playButtonRect;
</script>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>

<div>
  <PageTitle>Playlist</PageTitle>
  <ul>
    {#each episodes as episode}
      <PlaylistItem {episode} {playButtonRect} />
    {/each}
  </ul>
</div>
