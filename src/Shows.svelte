<script>
  import { onMount } from "svelte";

  import RssShowSearch from "./RssShowSearch.svelte";
  import ShowList from "./ShowList.svelte";
  import {
    allShowSubscriptions,
    subscribeToShowRss,
  } from "./userData/showSubscriptions";

  onMount(() => {
    refreshShows();
  });
  let shows = [];

  function handleChange({ detail: { showRssFeedUrl } }) {
    subscribeToShowRss(showRssFeedUrl).then(refreshShows);
  }

  function refreshShows() {
    allShowSubscriptions()
      .then((showSubscriptions) =>
        Promise.all(
          showSubscriptions.map((showSubscription) =>
            showSubscription.fetchShow()
          )
        )
      )
      .then((allShows) => {
        shows = allShows;
      });
  }
</script>

<div>
  <RssShowSearch on:change={handleChange} />
  <ShowList {shows} />
</div>
