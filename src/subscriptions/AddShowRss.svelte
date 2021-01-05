<script>
  import navigate from "../routing/navigate";
  import { makeUrl } from "./RssShowPage.svelte";

  let url = "";

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/subscriptions/shows/rss?" + makeUrl(url.trim()));
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
    <input id="url" type="url" bind:value={url} required />
  </div>
  <div><button>Confirm</button></div>
</form>
