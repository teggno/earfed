<script>
    import ItemLayout from "../layouts/ItemLayout.svelte";
    import ItemSubtitle from "../layouts/ItemSubtitle.svelte";
    import ItemTitle from "../layouts/ItemTitle.svelte";
    import ListLayout from "../layouts/ListLayout.svelte";
    import { makeUrl } from "./AppleShowPage.svelte";

    export let shows = [];
</script>

<style>
    a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
    }
</style>

<ListLayout items={shows} let:item={show}>
    <a href={makeUrl(show.collectionId)}>
        <ItemLayout>
            <img
                slot="image"
                src={show.artworkUrl60}
                alt=""
                crossorigin="anonymous" />
            <div slot="title">
                <ItemTitle>{show.collectionName}</ItemTitle>
            </div>
            <div slot="subtitle">
                <ItemSubtitle>{show.artistName}</ItemSubtitle>
            </div>
        </ItemLayout>
    </a>
</ListLayout>
