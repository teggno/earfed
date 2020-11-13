<script>
  export let shows = [];
</script>

<ul>
  {#each shows as show}
    <li>{show.showName}</li>
  {/each}
</ul>
