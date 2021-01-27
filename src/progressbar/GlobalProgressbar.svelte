<script lang="ts">
  import { getGlobalProgressbar } from "./globalProgressbar";
  import Progressbar from "./Progressbar.svelte";

  const globalProgressbar = getGlobalProgressbar();
  const visible = globalProgressbar.visible;
</script>

<div class="globalProgressbar">
  {#if $visible}
    <Progressbar />
  {/if}
</div>

<style>
  .globalProgressbar {
    height: var(--progress-bar-height);
    position: fixed;
    width: var(--app-max-width, 100%);
    top: 0;
    z-index: 9;
  }

  .globalProgressbar > :global(*) {
    height: 100%;
  }
</style>
