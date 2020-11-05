<script>
  import PageTitle from "./PageTitle.svelte";
  import PlaylistItem from "./PlaylistItem.svelte";
  import { playerInfo, playing } from "./playerService";

  export let episodes = [];

  $: currentEpisode = $playerInfo.episode;
  $: playerPlaying = $playerInfo.status === playing;
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
      <PlaylistItem
        {episode}
        playing={playerPlaying && currentEpisode && currentEpisode.episodeUrl === episode.episodeUrl} />
    {/each}
  </ul>
</div>
