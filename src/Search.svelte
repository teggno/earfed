<script>
  let searchText = "syntax";
  let results = [];
  const itunesBaseUrl = "https://itunes.apple.com/search";

  function handleSubmit(e) {
    e.preventDefault();
    search();
  }

  function search() {
    fetch(makeEpisodeSearchUrl(searchText))
      .then((response) => response.json())
      .then((json) => {
        results = json.results;
      });
  }

  function makeShowSearchUrl(searchText) {
    return `${itunesBaseUrl}/search?media=podcast&entity=podcastEpisode&term=${encodeURIComponent(
      searchText
    )}`;
  }
  function makeEpisodeSearchUrl(searchText) {
    return `${itunesBaseUrl}/search?media=podcast&term=${encodeURIComponent(
      searchText
    )}`;
  }
</script>

<style>
  input {
  }
</style>

<form on:submit={handleSubmit}>
  <label for="searchField">Search</label>
  <input id="searchField" type="search" bind:value={searchText} />
  <button>Go</button>
</form>
<!-- {#if results.length}{JSON.stringify(results[0])}{/if} -->
<ul>
  {#each results as result}
    <li>
      <img
        src={result.artworkUrl60}
        alt=""
        crossorigin="anonymous" />{result.kind}{result.artistName}{result.collectionName}
    </li>
  {/each}
</ul>
