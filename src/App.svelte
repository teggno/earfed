<script>
  import BottomBar from "./BottomBar.svelte";
  import NowPlaying from "./NowPlaying.svelte";
  import Playlist from "./Playlist.svelte";
  import { initAnimationTargetRect } from "./animationTargetRect";

  const episodes = getEpisodes();

  function getEpisodes() {
    const episodes = [
      {
        showName: `.Net Rocks`,
        episodeTitle:
          "The Business Case of AI and Data Science with Joel Hulen and Kyle Bunting",
        episodeDescription:
          "Everyone wants AI - but where's the business value? Carl and Richard talk to Joel Hulen and Kyle Bunting about building machine learning models and what they can do for business. The conversation starts out with the typical AI-destroys-the-world debate, recognizing that these tools are just that, tools. Using them responsibly is important, but so is focusing on business value. What can this technology help with? Usually, the first goal is not the goal delivered!",
        episodeUrl:
          "https://stream.redcircle.com/episodes/493397ff-532f-40a0-842c-8b4a5ed1e5ce/stream.mp3",
        showIconUrl: "http://www.pwop.com/itunes_dnr2.jpg",
      },
      {
        showName: `.Net Rocks`,
        episodeTitle: "The .NET Foundation Evolves with Layla Porter",
        episodeDescription:
          "A new .NET Foundation board is elected - what does it mean for you? Carl and Richard talk to Layla Porter about her new role on the .NET Foundation board and the goals of the foundation to grow its membership, bring more open source projects into the fold, support the maintainers of those projects and to broaden the reach of .NET everywhere. Layla talks about finding new ways to connect with folks in the .NET community and the challenge of evolving a young foundation.",
        episodeUrl:
          "https://stream.redcircle.com/episodes/20aba98d-f6d8-40d0-89a9-8389a3e705e1/stream.mp3",
        showIconUrl: "http://www.pwop.com/itunes_dnr2.jpg",
      },
    ];
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
