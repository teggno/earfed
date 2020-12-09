<script context="module">
  export function makeUrl(collectionId) {
    return `/search/shows/apple/${collectionId}`;
  }
  function extractCollectionId(url) {
    const parts = url.split("/");
    return parts[parts.length - 1];
  }
</script>

<script>
  import EpisodesOfShow from "../EpisodesOfShow.svelte";
  import { refreshPlaylist } from "../playlistService";

  import {
    subscribeToShow,
    addEpisodes,
    fetchShow,
  } from "../providers/apple/providerApple";
  import Show from "../Show.svelte";
  import { refreshShows } from "../showService";
  import { arrayOfLength } from "../utils";

  let collectionId = extractCollectionId(location.href);
  let show;
  let showPromise = fetchShow({ collectionId }).then((s) => {
    show = s;
    selectedIndices = arrayOfLength(Math.min(5, s.episodes.length), (i) => i);
    return show;
  });
  let selectedIndices = [];

  async function handleSubscribeClick() {
    const showJustSubscribed = await subscribeToShow(collectionId);

    const episodesToAdd = selectedIndices.map((i) => show.episodes[i]);
    await addEpisodes(showJustSubscribed.showId, episodesToAdd, new Date());

    refreshShows();
    refreshPlaylist();
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
