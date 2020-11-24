<script>
  import PageTitle from "./PageTitle.svelte";
  import PlaylistItem from "./PlaylistItem.svelte";
  import { playerInfo, playing } from "./playerService";
  import { areEpisodesEqual } from "./episode";
  import { afterUpdate } from "svelte";
  import { playlist } from "./playlistService";

  let expandedEpisode;
  let indexOfPreviouslyExpandedEpisode = -1;

  $: currentEpisode = $playerInfo.episode;
  $: playerPlaying = $playerInfo.status === playing;

  afterUpdate(() => {
    indexOfPreviouslyExpandedEpisode = $playlist.findIndex((e) =>
      areEpisodesEqual(e, expandedEpisode)
    );
  });

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
    {#each $playlist as episode, index}
      <PlaylistItem
        {episode}
        playing={playerPlaying && currentEpisode && areEpisodesEqual(currentEpisode, episode)}
        expanded={areEpisodesEqual(expandedEpisode, episode)}
        delayInTransition={indexOfPreviouslyExpandedEpisode !== -1 && indexOfPreviouslyExpandedEpisode < index}
        on:toggleExpanded={() => toggleExpanded(episode)} />
    {/each}
  </ul>
</div>
