<script>
  import ShowList from "./ShowList.svelte";
  import link from "../routing/linkAction";
  import { allShowsStore } from "../showService";
  import { loaded } from "../threeState";
</script>

<div>
  <button use:link={{ path: '/subscriptions/addrss' }}>Add RSS Feed</button>
  {#if $allShowsStore.state === loaded}
    <ShowList shows={$allShowsStore.data.filter((show) => show.subscribed)} />
  {/if}
</div>
