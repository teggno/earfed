<script>
  import BottomBar from "./BottomBar.svelte";
  import NowPlaying from "./NowPlaying.svelte";
  import Playlist from "./Playlist.svelte";
  import { initAnimationTargetRect } from "./animationTargetRect";

  const episodes = getEpisodes();

  function getEpisodes() {
    const episodes = [];
    for (var i = 0; i < 30; i++) {
      episodes.push({
        showName: `Show ${i + 1}`,
        episodeTitle: "Episode foobar",
        // showIconUrl: "https://www.pwop.com/itunes_dnr2.jpg",
      });
    }
    return episodes;
  }

  initAnimationTargetRect();
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
