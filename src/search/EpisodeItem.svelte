<script lang="ts">
  import { formatDate } from "../dates";
  import ItemLayout from "../layouts/ItemLayout.svelte";
  import ItemSubtitle from "../layouts/ItemSubtitle.svelte";
  import ItemTitle from "../layouts/ItemTitle.svelte";
  import QueueEpisodeButton from "../QueueEpisodeButton.svelte";
  import { makeUrl } from "./AppleShowPage.svelte";
  import { EpisodeQueueStatus } from "../userData/episodeTypes";
  import { createEventDispatcher } from "svelte";

  export let episode: Episode;

  interface Episode {
    trackName: string;
    releaseDate: string | undefined;
    artworkUrl60: string | undefined;
    collectionId: number;
    collectionName: string | undefined;
    queueStatus: EpisodeQueueStatus | undefined;
  }

  const dispatch = createEventDispatcher();

  async function handleQueueEpisodeClick(episode: Episode) {
    dispatch("queueepisode");
  }
</script>

<ItemLayout>
  <img slot="image" src={episode.artworkUrl60} alt="" crossorigin="anonymous" />
  <div slot="title">
    <ItemTitle>{episode.trackName}</ItemTitle>
  </div>
  <div slot="subtitle">
    <ItemSubtitle>
      {episode.releaseDate
        ? `${formatDate(new Date(episode.releaseDate))} •`
        : ""}
      <a href={makeUrl(episode.collectionId)}
        >{episode.collectionName || "view show"}</a
      >
    </ItemSubtitle>
  </div>
  <div slot="actions">
    <QueueEpisodeButton
      queued={episode.queueStatus == EpisodeQueueStatus.Queued}
      on:click={() => handleQueueEpisodeClick(episode)}
    />
  </div>
</ItemLayout>

<style>
  a {
    text-decoration: underline;
    color: inherit;
  }
</style>
