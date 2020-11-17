<script>
  import { onMount } from "svelte";

  import ShowList from "./ShowList.svelte";
  import { showSubscriptionToShow } from "./showService";
  import { allShowSubscriptions } from "./userData/showSubscriptions";
  import link from "./routing/linkAction";

  onMount(() => {
    refreshShows();
  });
  let shows = [];

  function refreshShows() {
    allShowSubscriptions()
      .then((showSubscriptions) =>
        Promise.all(showSubscriptions.map(showSubscriptionToShow))
      )
      .then((allShows) => {
        shows = allShows;
      });
  }
</script>

<div>
  <button use:link={{ path: '/shows/addrss' }}>Add Show</button>
  <ShowList {shows} />
</div>
