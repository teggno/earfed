<script>
  import PageTitle from "../PageTitle.svelte";
  import QueueItem from "./QueueItem.svelte";
  import { playerInfo, playing } from "../playerService";
  import { areEpisodesEqual } from "../episode";
  import { afterUpdate } from "svelte";
  import orderable from "../actions/orderableAction";
  import { putEpisodeOrder } from "../userData/episodeOrder";
  import { refreshOrder } from "../queueService";
  import { loaded } from "../threeState";

  export let queueState;
  let expandedEpisode;
  let indexOfPreviouslyExpandedEpisode = -1;
  let dragHandleVisible = false;
  let ul;
  let indexOfOrderedItem;

  $: currentEpisode = $playerInfo.episode;
  $: playerPlaying = $playerInfo.status === playing;

  afterUpdate(() => {
    const { state, data } = $queueState;
    indexOfPreviouslyExpandedEpisode =
      state === loaded
        ? data.findIndex((e) => areEpisodesEqual(e, expandedEpisode))
        : -1;
  });

  function toggleExpanded(episode) {
    expandedEpisode = areEpisodesEqual(expandedEpisode, episode)
      ? undefined
      : episode;
  }

  function episodeKey(episodeId) {
    return `${episodeId.provider}_${episodeId.providerEpisodeId}`;
  }

  function handleOrderStart({ detail }) {
    indexOfOrderedItem = detail.indexOfOrderedItem;
    dragHandleVisible = true;
  }

  function handleOrderEnd({ detail }) {
    dragHandleVisible = false;

    if (typeof detail.orderedNodeIndex === "undefined") return;

    const { orderedNodeIndex, targetNodeIndex, beforeTargetNode } = detail;
    console.log(detail);
    const items = $queueState.data;
    const newOrder = items.flatMap((item, index) => {
      if (index === orderedNodeIndex) {
        return [];
      } else if (index === targetNodeIndex) {
        return beforeTargetNode
          ? [items[orderedNodeIndex], item]
          : [item, items[orderedNodeIndex]];
      } else {
        return [item];
      }
    });
    putEpisodeOrder(newOrder.map(({ episodeId }) => episodeId));
    refreshOrder();
  }
</script>

<style>
  ul {
    /* --padding-bottom: calc(
      var(--mini-player-height) + var(--mini-player-bottom)
    ); */
    list-style: none;
    margin: 0;
    padding: 0 0 var(--padding-bottom) 0;
  }

  ul > :global(li) {
    border-top-width: 0;
    border-bottom-width: 0;
    border-top-style: solid;
    border-bottom-style: solid;
    border-color: #444;
    /* NOTE: The transition is set in QueueItem because there is another transition too. Ugly but avoids a wrapper element.*/
  }

  ul > :global(li.dropBefore) {
    border-top-style: solid;
    border-top-width: 4px;
  }
  ul > :global(li.dropAfter) {
    border-bottom-style: solid;
    border-bottom-width: 4px;
  }
</style>

<div>
  <PageTitle>Episode Queue</PageTitle>
  {#if $queueState.state === 'loaded'}
    <ul
      use:orderable={{ css: { beforeClass: 'dropBefore', afterClass: 'dropAfter' } }}
      on:orderstart={handleOrderStart}
      on:orderend={handleOrderEnd}
      bind:this={ul}>
      {#each $queueState.data as episode, index (episodeKey(episode.episodeId))}
        <QueueItem
          {episode}
          playing={playerPlaying && currentEpisode && areEpisodesEqual(currentEpisode, episode)}
          expanded={areEpisodesEqual(expandedEpisode, episode)}
          delayInTransition={indexOfPreviouslyExpandedEpisode !== -1 && indexOfPreviouslyExpandedEpisode < index}
          {dragHandleVisible}
          on:click={() => {
            if (index !== indexOfOrderedItem) toggleExpanded(episode);
            indexOfOrderedItem = undefined;
          }} />
      {/each}
    </ul>
  {/if}
</div>
