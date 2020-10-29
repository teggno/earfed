<script>
  import BottomBarButton from "./BottomBarButton.svelte";
  import LibraryIcon from "./icons/LibraryIcon.svelte";
  import PlaylistIcon from "./icons/PlaylistIcon.svelte";
</script>

<style>
  div {
    position: fixed;
    bottom: 0;
    width: var(--app-max-width, 100%);
    display: flex;
    justify-content: space-evenly;
    background-color: var(--color-background);
  }
</style>

<div>
  <BottomBarButton text={'Shows'}>
    <LibraryIcon />
  </BottomBarButton>
  <BottomBarButton text={'Playlist'} selected>
    <PlaylistIcon />
  </BottomBarButton>
</div>
