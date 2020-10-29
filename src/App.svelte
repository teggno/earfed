<script>
  import BottomBar from "./BottomBar.svelte";
  import NowPlaying from "./NowPlaying.svelte";
  import Playlist from "./Playlist.svelte";
  import { rect } from "./animationTargetRect";

  const episodes = getEpisodes();

  function getEpisodes() {
    const episodes = [];
    for (var i = 0; i < 30; i++) {
      episodes.push({
        showName: `Show ${i + 1}`,
        episodeTitle: "Episode foobar",
      });
    }
    return episodes;
  }
</script>

<style>
  .container {
  }
</style>

<div class="container">
  <main>
    <Playlist {episodes} playButtonRect={rect} />
    <NowPlaying playButtonRect={rect} />
  </main>
  <BottomBar />
</div>
