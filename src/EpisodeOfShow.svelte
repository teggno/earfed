<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { formatDate } from "./dates";
  import ItemLayout from "./layouts/ItemLayout.svelte";
  import ItemSubtitle from "./layouts/ItemSubtitle.svelte";
  import ItemTitle from "./layouts/ItemTitle.svelte";
  import QueueEpisodeButton from "./QueueEpisodeButton.svelte";
  import { EpisodeQueueStatus } from "./userData/episodeTypes";

  export let episode: Episode;
  interface Episode {
    episodeTitle: string;
    pubDate: Date | undefined;
    queueStatus: EpisodeQueueStatus | undefined;
  }

  const dispatch = createEventDispatcher();

  function handleQueueEpisodeClick() {
    dispatch("queueepisode");
  }
</script>

<ItemLayout>
  <div slot="title">
    <ItemTitle>{episode.episodeTitle}</ItemTitle>
  </div>
  <div slot="subtitle">
    <ItemSubtitle
      >{episode.pubDate ? formatDate(episode.pubDate) : ""}</ItemSubtitle
    >
  </div>
  <div slot="actions">
    <QueueEpisodeButton
      queued={episode.queueStatus == EpisodeQueueStatus.Queued}
      on:click={() => handleQueueEpisodeClick()}
    />
  </div>
</ItemLayout>
