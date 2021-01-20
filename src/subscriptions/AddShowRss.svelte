<script lang="ts">
  import navigate from "../routing/navigate";
  import { makeUrl } from "./RssShowPage.svelte";

  let url = "";

  function handleSubmit(e: Event) {
    e.preventDefault();
    navigate("/subscriptions/shows/rss?" + makeUrl(url.trim()));
  }
</script>

<form on:submit={handleSubmit}>
  <div>
    <label for="url">URL</label>
    <input id="url" type="url" bind:value={url} required />
  </div>
  <div><button>Confirm</button></div>
</form>

<style>
  input {
    width: 100%;
  }
</style>
