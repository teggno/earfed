<script lang="ts">
  import link from "../routing/linkAction";
  import { shows as showsStateStore } from "../showService";
  import { loaded } from "../threeState";
  import { ShowStatus } from "../userData/showTypes";
  import ShowList from "./ShowList.svelte";

  $: shows = $showsStateStore;
</script>

<div>
  <button use:link={{ path: "/subscriptions/addrss" }}>Add RSS Feed</button>
  {#if shows.state === loaded}
    <ShowList
      shows={shows.data.filter((show) => show.status === ShowStatus.Subscribed)}
    />
  {/if}
</div>
