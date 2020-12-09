<script>
  import { parseQuery } from "../urls";
  import { arrayOfLength } from "../utils";
  import { refreshPlaylist } from "../playlistService";
  import { refreshShows } from "../showService";
  import Show from "../Show.svelte";
  import {
    fetchShow,
    subscribeToShow,
    addEpisodes,
  } from "../providers/rss/providerRss";
  import EpisodesOfShow from "../EpisodesOfShow.svelte";

  let selectedIndices = [];
  let show;

  let showPromise = fetchShow({ rssFeedUrl: rssFeedUrlFromQuery() }).then(
    (fetchedShow) => {
      selectedIndices = arrayOfLength(
        Math.min(5, fetchedShow.episodes.length),
        (i) => i
      );
      show = {
        ...fetchedShow,
        episodes: fetchedShow.episodes.sort(
          (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
        ),
      };
      return show;
    }
  );

  async function handleSubscribeClick() {
    const showJustSubscribed = await subscribeToShow(rssFeedUrlFromQuery());

    const episodesToAdd = selectedIndices.map((i) => show.episodes[i]);
    await addEpisodes(showJustSubscribed.showId, episodesToAdd, new Date());

    refreshShows();
    refreshPlaylist();
  }

  function rssFeedUrlFromQuery() {
    return decodeURIComponent(parseQuery(window.location.search).rssFeedUrl);
  }

  function handleEpisodeSelectionChange({ detail: { selectedIndices: sel } }) {
    selectedIndices = sel;
  }
</script>

{#await showPromise then show}
  <Show {show} />
  <button on:click={handleSubscribeClick}>Subscribe</button>
  <EpisodesOfShow
    episodes={show.episodes}
    {selectedIndices}
    on:change={handleEpisodeSelectionChange} />
{/await}
