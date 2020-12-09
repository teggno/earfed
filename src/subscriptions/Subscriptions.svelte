<script>
  import ShowList from "./ShowList.svelte";
  import link from "../routing/linkAction";
  import { allShowsStore } from "../showService";
</script>

<div>
  <button use:link={{ path: '/subscriptions/addrss' }}>Add RSS Feed</button>
  <ShowList shows={$allShowsStore.data} />
</div>
