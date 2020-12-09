<script>
  import BottomBarButton from "./BottomBarButton.svelte";
  import PlaylistIcon from "./icons/PlaylistIcon.svelte";
  import SearchIcon from "./icons/SearchIcon.svelte";
  import SubscriptionsIcon from "./icons/SubscriptionsIcon.svelte";

  const subscriptions = "subscriptions";
  const search = "search";
</script>

<style>
  div {
    position: fixed;
    bottom: 0;
    width: var(--app-max-width, 100%);
    display: flex;
    justify-content: space-evenly;
    background-color: #fefefe;
    z-index: 5;
  }
</style>

<div>
  <BottomBarButton text={'Queue'} path="/">
    <PlaylistIcon />
  </BottomBarButton>
  <BottomBarButton
    text={'Subscriptions'}
    path={`/${subscriptions}`}
    isActive={(activePath) => activePath.indexOf(subscriptions) === 0}>
    <SubscriptionsIcon />
  </BottomBarButton>
  <BottomBarButton
    text={'Search'}
    path={`/${search}`}
    isActive={(activePath) => activePath.indexOf(search) === 0}>
    <SearchIcon />
  </BottomBarButton>
</div>
