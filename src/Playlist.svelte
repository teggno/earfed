<script>
  import PageTitle from "./PageTitle.svelte";
  import PlaylistItem from "./PlaylistItem.svelte";
  import { playerInfo, playing } from "./playerService";
  import { areEpisodesEqual } from "./episode";

  export let episodes = [];
  let expandedEpisode;

  $: currentEpisode = $playerInfo.episode;
  $: playerPlaying = $playerInfo.status === playing;

  function toggleExpanded(episode) {
    expandedEpisode = areEpisodesEqual(expandedEpisode, episode)
      ? undefined
      : episode;
  }
</script>

<style>
  ul {
    --padding-bottom: calc(
      var(--mini-player-height) + var(--mini-player-bottom)
    );
    list-style: none;
    margin: 0;
    padding: 0 0 var(--padding-bottom) 0;
  }
</style>

<div>
  <PageTitle>Playlist</PageTitle>
  <ul>
    {#each episodes as episode}
      <PlaylistItem
        {episode}
        playing={playerPlaying && currentEpisode && areEpisodesEqual(currentEpisode, episode)}
        expanded={areEpisodesEqual(episode, expandedEpisode)}
        on:toggleExpanded={() => toggleExpanded(episode)} />
    {/each}
  </ul>
</div>
