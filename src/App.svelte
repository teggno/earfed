<script>
  import BottomBar from "./BottomBar.svelte";
  import NowPlaying from "./NowPlaying.svelte";
  import Playlist from "./Playlist.svelte";
  import { initAnimationTargetRect } from "./animationTargetRect";
  import { getEpisodes } from "./dummyData";
  import * as playerService from "./playerService";
  import { connectNotificationBar } from "./notificationBarService";
  import { onMount } from "svelte";
  import { areEpisodesEqual } from "./episode";

  const episodes = getEpisodes();

  initAnimationTargetRect();

  onMount(() => {
    return connectNotificationBarToPlayerService();
  });

  function connectNotificationBarToPlayerService() {
    const updater = connectNotificationBar(playerService);
    let currentEpisode;
    return playerService.playerInfo.subscribe((info) => {
      if (info.episode && !areEpisodesEqual(info.episode, currentEpisode)) {
        updater(info.episode);
      }
      currentEpisode = info.episode;
    });
  }
</script>

<style>
</style>

<div class="container">
  <main>
    <Playlist {episodes} />
    <NowPlaying />
  </main>
  <BottomBar />
</div>
