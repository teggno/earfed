<script>
  import BottomBarButton from "./BottomBarButton.svelte";
  import LibraryIcon from "./icons/LibraryIcon.svelte";
  import PlaylistIcon from "./icons/PlaylistIcon.svelte";

  const shows = "shows";
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
    path={shows}
    isActive={(activePath) => activePath.indexOf(shows) === 0}>
    <LibraryIcon />
  </BottomBarButton>
  <BottomBarButton text={'Playlist'} path="/">
    <PlaylistIcon />
  </BottomBarButton>
</div>
