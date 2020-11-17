<script>
  import { subscriptionQuery } from "./providers/rss/providerRss";

  import navigate from "./routing/navigate";

  let url = "https://feed.syntax.fm/rss";

  function handleSubmit(e) {
    e.preventDefault();
    navigate(
      "/shows/subscribe?" + subscriptionQuery(encodeURIComponent(url.trim()))
    );
  }
</script>

<style>
  input {
    width: 100%;
  }
</style>

<form on:submit={handleSubmit}>
  <div>
    <label for="url">URL</label>
    <input id="url" type="url" bind:value={url} />
  </div>
  <div><button>Confirm</button></div>
</form>
