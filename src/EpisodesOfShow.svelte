<script>
  import { createEventDispatcher } from "svelte";
  import { formatDate } from "./dates";
  import ItemLayout from "./layouts/ItemLayout.svelte";
  import ItemSubtitle from "./layouts/ItemSubtitle.svelte";
  import ItemTitle from "./layouts/ItemTitle.svelte";
  import ListLayout from "./layouts/ListLayout.svelte";
  import QueueEpisodeButton from "./QueueEpisodeButton.svelte";

  export let episodes;

  const dispatch = createEventDispatcher();

  function handleQueueEpisodeClick(episode) {
    dispatch("queueepisode", { episode });
  }

  function byPubDate(a, b) {
    return b.pubDate.valueOf() - a.pubDate.valueOf();
  }
</script>

<ListLayout items={episodes.sort(byPubDate)} let:item={episode}>
  <ItemLayout>
    <div slot="title">
      <ItemTitle>{episode.episodeTitle}</ItemTitle>
    </div>
    <div slot="subtitle">
      <ItemSubtitle>{formatDate(episode.pubDate)}</ItemSubtitle>
    </div>
    <div slot="actions">
      <QueueEpisodeButton
        queued={episode.queued}
        on:click={() => handleQueueEpisodeClick(episode)} />
    </div>
  </ItemLayout>
</ListLayout>
