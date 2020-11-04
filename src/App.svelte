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
      {
        showName: `Syntax - Tasty Web Development Treats`,
        episodeTitle:
          "Hasty Treat - Certifications? Government Specified JavaScript Skills?",
        episodeDescription:
          '<p class="has-line-data" data-line-start="7" data-line-end="8">In this Hasty Treat, Scott and Wes talk about web dev certifications — are they worth it, or a waste of time?</p> <h2 class="code-line" data-line-start="9" data-line-end="10"><a id= "Sentry__Sponsor_9" name="Sentry__Sponsor_9"></a>Sentry - Sponsor</h2> <p class="has-line-data" data-line-start="10" data-line-end="11">If you want to know what’s happening with your errors, track them with <a href="https://sentry.io/">Sentry</a>. Sentry is open-source error tracking that helps developers monitor and fix crashes in real time. Cut your time on error resolution from five hours to five minutes. It works with any language and integrates with dozens of other services. Syntax listeners can get two months for free by visiting <a href= "https://sentry.io/">Sentry.io</a> and using the coupon code “tastytreat”.</p> <h2 class="code-line" data-line-start="12" data-line-end="13"> <a id="Show_Notes_12" name="Show_Notes_12"></a>Show Notes</h2> <p class="has-line-data" data-line-start="14" data-line-end="15"> 02:12 - Certifications</p> <p class="has-line-data" data-line-start="16" data-line-end="17"> 05:30 - We have standards, and people move faster than standards.</p> <ul> <li class="has-line-data" data-line-start="17" data-line-end="18"> jQuery moved faster than vanilla JS</li> <li class="has-line-data" data-line-start="18" data-line-end="19"> Typescript is sometimes preferred over regular JS</li> <li class="has-line-data" data-line-start="19" data-line-end="20"> We have universities that offer web developer certs and many of them are a joke</li> <li class="has-line-data" data-line-start="20" data-line-end="22"> The point is that programming is the wild west — it’s far too broad and moves far too fast for us to try and fit it in a box</li> </ul> <p class="has-line-data" data-line-start="22" data-line-end="23"> 10:28 - Do certifications mean anything?</p> <p class="has-line-data" data-line-start="24" data-line-end="25"> 14:30 - How do you know if you have enough skills (when you’re job hunting)?</p> <p class="has-line-data" data-line-start="26" data-line-end="27"> 19:04 - Some jobs do require a certification</p> <ul> <li class="has-line-data" data-line-start="27" data-line-end="28"> AWS</li> <li class="has-line-data" data-line-start="28" data-line-end="30"> Google</li> </ul> <h2 class="code-line" data-line-start="30" data-line-end="31"> <a id="Links_30" name="Links_30"></a>Links</h2> <ul> <li class="has-line-data" data-line-start="31" data-line-end="32"> <a href= "https://openjsf.org/certification/">https://openjsf.org/certification/</a></li> <li class="has-line-data" data-line-start="32" data-line-end="33"> <a href= "https://www.sentiatechblog.com/imposter-syndrome-how-to-display-front-end"> https://www.sentiatechblog.com/imposter-syndrome-how-to-display-front-end</a></li> <li class="has-line-data" data-line-start="33" data-line-end="34"> <a href= "https://twitter.com/wesbos/status/1318192217824124928">https://twitter.com/wesbos/status/1318192217824124928</a></li> <li class="has-line-data" data-line-start="34" data-line-end="35"> <a href= "https://twitter.com/photonstorm/status/1318193404312944641">https://twitter.com/photonstorm/status/1318193404312944641</a></li> <li class="has-line-data" data-line-start="35" data-line-end="36"> <a href= "https://twitter.com/Ky1e_S/status/1318193954085634048">https://twitter.com/Ky1e_S/status/1318193954085634048</a></li> <li class="has-line-data" data-line-start="36" data-line-end="37"> <a href= "https://twitter.com/ArleyM/status/1318194323821912067">https://twitter.com/ArleyM/status/1318194323821912067</a></li> <li class="has-line-data" data-line-start="37" data-line-end="39"> <a href= "https://twitter.com/ajitbohra/status/1318194600335470592">https://twitter.com/ajitbohra/status/1318194600335470592</a></li> </ul> <h2 class="code-line" data-line-start="39" data-line-end="40"> <a id="Tweet_us_your_tasty_treats_39" name= "Tweet_us_your_tasty_treats_39"></a>Tweet us your tasty treats!</h2> <ul> <li class="has-line-data" data-line-start="40" data-line-end="41"> <a href="https://www.instagram.com/stolinski/">Scott’s Instagram</a></li> <li class="has-line-data" data-line-start="41" data-line-end="42"> <a href= "https://www.instagram.com/LevelUpTutorials/">LevelUpTutorials Instagram</a></li> <li class="has-line-data" data-line-start="42" data-line-end="43"> <a href="https://www.instagram.com/wesbos/">Wes’ Instagram</a></li> <li class="has-line-data" data-line-start="43" data-line-end="44"> <a href="https://twitter.com/wesbos">Wes’ Twitter</a></li> <li class="has-line-data" data-line-start="44" data-line-end="45"> <a href="https://www.facebook.com/wesbos.developer">Wes’ Facebook</a></li> <li class="has-line-data" data-line-start="45" data-line-end="46"> <a href="https://twitter.com/stolinski">Scott’s Twitter</a></li> <li class="has-line-data" data-line-start="46" data-line-end="47"> Make sure to include <a href= "https://twitter.com/SyntaxFM">@SyntaxFM</a> in your tweets</li> </ul>',
        episodeUrl:
          "https://traffic.libsyn.com/secure/syntax/Syntax297.mp3?dest-id=532671",
        showIconUrl:
          "https://ssl-static.libsyn.com/p/assets/7/9/0/7/790703531a3c8eca/iTunes_Artwork.png",
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
