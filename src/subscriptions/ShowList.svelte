<script>
  import ShowListItem from "./ShowListItem.svelte";

  export let shows = [];
</script>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>

<ul>
  {#each shows as show}
    <ShowListItem {show} />
  {/each}
</ul>
