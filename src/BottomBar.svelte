<script>
  import { createEventDispatcher } from "svelte";

  import BottomBarButton from "./BottomBarButton.svelte";
  import LibraryIcon from "./icons/LibraryIcon.svelte";
  import PlaylistIcon from "./icons/PlaylistIcon.svelte";

  export let selectedItemName = "";

  const shows = "shows";
  const playlist = "playlist";

  const dispatch = createEventDispatcher();

  function handleClick(name) {
    dispatch("change", { selectedItemName: name });
  }
</script>

<style>
  div {
    position: fixed;
    bottom: 0;
    width: var(--app-max-width, 100%);
    display: flex;
    justify-content: space-evenly;
    background-color: var(--color-background);
    z-index: 5;
  }
</style>

<div>
  <BottomBarButton
    text={'Shows'}
    on:click={() => handleClick(shows)}
    selected={selectedItemName === shows}>
    <LibraryIcon />
  </BottomBarButton>
  <BottomBarButton
    text={'Playlist'}
    on:click={() => handleClick(playlist)}
    selected={selectedItemName === playlist}>
    <PlaylistIcon />
  </BottomBarButton>
</div>
