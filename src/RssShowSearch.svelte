<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let url = "https://feed.syntax.fm/rss";

  function handleSubmit(e) {
    e.preventDefault();
    dispatch("change", { showRssFeedUrl: url.trim() });
  }
</script>

<form on:submit={handleSubmit}>
  <input type="url" bind:value={url} />
  <button>Subscribe</button>
</form>
