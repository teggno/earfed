<script lang="ts">
  import PageTitle from "../PageTitle.svelte";
  import QueueItem from "./QueueItem.svelte";
  import player from "../player/player";
  import { afterUpdate } from "svelte";
  import orderable from "../actions/orderableAction";
  import { putEpisodeOrder } from "../userData/episodeOrder";
  import { queueState, refreshOrder } from "../queueService";
  import { loaded } from "../threeState";
  import type AppleEpisode from "../domain/AppleEpisode";
  import type RssEpisode from "../domain/RssEpisode";

  let expandedEpisode: { uniqueEpisodeId: string } | undefined;
  let indexOfPreviouslyExpandedEpisode = -1;
  let dragHandleVisible = false;
  let ul;
  let indexOfOrderedItem: number | undefined;

  const playerStore = player.playerStore;

  $: qs = $queueState;
  $: playerInfo = $playerStore;
  $: currentEpisode =
    playerInfo.state === "hasEpisode" ? playerInfo.episode : undefined;
  $: playing = playerInfo.state === "hasEpisode" && playerInfo.playing;

  afterUpdate(() => {
    if (qs.state !== "loaded") return;
    const { state, data } = qs;
    indexOfPreviouslyExpandedEpisode =
      state === loaded
        ? data.findIndex(
            (e) => e.uniqueEpisodeId === expandedEpisode?.uniqueEpisodeId
          )
        : -1;
  });

  function toggleExpanded(episode: { uniqueEpisodeId: string }) {
    expandedEpisode =
      episode.uniqueEpisodeId === expandedEpisode?.uniqueEpisodeId
        ? undefined
        : episode;
  }

  function togglePlay(episode: AppleEpisode | RssEpisode) {
    if (currentEpisode?.uniqueEpisodeId === episode?.uniqueEpisodeId) {
      if (playing) {
        player.pause();
      } else {
        player.play();
      }
    } else {
      player.setEpisode(episode);
      if (episode.positionSeconds) {
        player.seek(episode.positionSeconds);
      }
      player.play();
    }
  }

  function handleOrderStart({ detail }) {
    indexOfOrderedItem = detail.indexOfOrderedItem;
    dragHandleVisible = true;
  }

  function handleOrderEnd({
    detail,
  }: {
    detail: {
      orderedNodeIndex: number | undefined;
      targetNodeIndex: number;
      beforeTargetNode: boolean;
    };
  }) {
    dragHandleVisible = false;

    if (qs.state !== loaded) return;
    if (typeof detail.orderedNodeIndex === "undefined") return;

    const { orderedNodeIndex, targetNodeIndex, beforeTargetNode } = detail;
    const queueEpisodes = qs.data;
    const newOrder = queueEpisodes.flatMap((item, index) => {
      if (index === orderedNodeIndex) {
        return [];
      } else if (index === targetNodeIndex) {
        return beforeTargetNode
          ? [queueEpisodes[orderedNodeIndex], item]
          : [item, queueEpisodes[orderedNodeIndex]];
      } else {
        return [item];
      }
    });
    putEpisodeOrder(newOrder.map(({ uniqueEpisodeId }) => uniqueEpisodeId));
    refreshOrder();
  }
</script>

<div>
  <PageTitle>Episode Queue</PageTitle>
  {#if qs.state === "loaded"}
    <ul
      use:orderable={{
        css: { beforeClass: "dropBefore", afterClass: "dropAfter" },
      }}
      on:orderstart={handleOrderStart}
      on:orderend={handleOrderEnd}
      bind:this={ul}
    >
      {#each qs.data as episode, index (episode.uniqueEpisodeId)}
        <QueueItem
          {episode}
          playing={playing &&
            currentEpisode &&
            currentEpisode.uniqueEpisodeId === episode.uniqueEpisodeId}
          expanded={expandedEpisode &&
            expandedEpisode.uniqueEpisodeId === episode.uniqueEpisodeId}
          delayInTransition={indexOfPreviouslyExpandedEpisode !== -1 &&
            indexOfPreviouslyExpandedEpisode < index}
          {dragHandleVisible}
          on:toggleplay={() => {
            togglePlay(episode);
          }}
          on:click={() => {
            if (index !== indexOfOrderedItem) toggleExpanded(episode);
            indexOfOrderedItem = undefined;
          }}
        />
      {/each}
    </ul>
  {/if}
</div>

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
