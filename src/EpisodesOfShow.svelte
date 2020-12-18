<script>
  import { createEventDispatcher } from "svelte";
  import { formatDate } from "./dates";
  import QueueEpisodeButton from "./QueueEpisodeButton.svelte";

  export let episodes;

  const dispatch = createEventDispatcher();

  function handleQueueEpisodeClick(episode) {
    dispatch("queueepisode", { episode });
  }
</script>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  span {
    font-size: var(--font-size-small);
    max-height: calc(var(--font-size-small) * 2 * var(--assumed-normal-lh));
    overflow: hidden;
    font-weight: 500;
    padding-bottom: var(--spacing-1);
  }

  li {
    display: flex;
    align-items: center;
    padding: var(--spacing-3);
  }

  li :global(*) {
    cursor: inherit;
  }

  .pubDate {
    font-size: var(--font-size-small);
    color: var(--color-text-muted);
  }

  .text {
    overflow-x: hidden;
  }
</style>

<ul>
  {#each episodes as episode, i}
    <li>
      <div class="text">
        <span>{episode.episodeTitle}</span>
        <div class="pubDate">{formatDate(episode.pubDate)}</div>
      </div>
      <QueueEpisodeButton
        {episode}
        on:click={() => handleQueueEpisodeClick(episode)} />
    </li>
  {/each}
</ul>
