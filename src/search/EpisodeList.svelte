<script>
    import { formatDate } from "../dates";
    import ItemLayout from "../layouts/ItemLayout.svelte";
    import ItemSubtitle from "../layouts/ItemSubtitle.svelte";
    import ItemTitle from "../layouts/ItemTitle.svelte";
    import ListLayout from "../layouts/ListLayout.svelte";
    import { enqueue } from "../playlistService";
    import {
        episodeRecord,
        showRecord,
    } from "../providers/apple/providerApple";
    import QueueEpisodeButton from "../QueueEpisodeButton.svelte";
    import { makeUrl } from "./AppleShowPage.svelte";

    export let episodes = [];

    function handleQueueEpisodeClick(episode) {
        const sr = showRecord(episode);
        const er = episodeRecord(episode);
        enqueue(sr, er);
    }
</script>

<style>
    a {
        text-decoration: underline;
        color: inherit;
    }
</style>

<ListLayout items={episodes} let:item={episode}>
    <ItemLayout>
        <img
            slot="image"
            src={episode.artworkUrl60}
            alt=""
            crossorigin="anonymous" />
        <div slot="title">
            <ItemTitle>{episode.trackName}</ItemTitle>
        </div>
        <div slot="subtitle">
            <ItemSubtitle>
                {formatDate(new Date(episode.releaseDate))}
                &#149;
                <a
                    class="showLink"
                    href={makeUrl(episode.collectionId)}>{episode.collectionName}</a>
            </ItemSubtitle>
        </div>
        <div slot="actions">
            <QueueEpisodeButton
                queued={episode.queued}
                on:click={() => handleQueueEpisodeClick(episode)} />
        </div>
    </ItemLayout>
</ListLayout>
