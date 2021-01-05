<script>
  import ItemLayout from "../layouts/ItemLayout.svelte";
  import ItemSubtitle from "../layouts/ItemSubtitle.svelte";
  import ItemTitle from "../layouts/ItemTitle.svelte";
  import ListLayout from "../layouts/ListLayout.svelte";

  export let shows = [];
</script>

<style>
  a {
    color: inherit;
    text-decoration: none;
  }
</style>

<ListLayout items={shows} let:item={show}>
  <a href={show.subscribedShowUrl}>
    <ItemLayout>
      <img
        slot="image"
        src={show.showImageUrl}
        alt=""
        crossorigin="anonymous" />
      <div slot="title">
        <ItemTitle>{show.showTitle}</ItemTitle>
      </div>
      <div slot="subtitle">
        <ItemSubtitle>{show.artistName}</ItemSubtitle>
      </div>
    </ItemLayout>
  </a>
</ListLayout>
