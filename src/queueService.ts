import { derived } from "svelte/store";
import type AppleEpisode from "./domain/AppleEpisode";
import type RssEpisode from "./domain/RssEpisode";
import {
  episodes as userDataEpisodesStore,
  refreshUserDataEpisodes,
} from "./episodeService";
import { Provider } from "./providers";
import { fetchCollection } from "./providers/apple/providerApple";
import { fetchChannel } from "./providers/rss/providerRss";
import { refreshShows, shows as allShowsStore } from "./showService";
import {
  lazyRefreshableThreeState,
  waitUntilLoaded,
  whenLoaded,
} from "./threeState";
import { getEpisodeOrder } from "./userData/episodeOrder";
import {
  addEpisodeOrChangeStatusToQueued,
  removeEpisode as removeEpisodeFromDb,
} from "./userData/episodes";
import {
  AppleTrack,
  EpisodeId,
  EpisodeQueueStatus,
  RssItem,
} from "./userData/episodeTypes";
import { addShowIfNotAdded, findShow } from "./userData/shows";
import type { RssFeedUrl } from "./userData/showTypes";
import { arrayToMap, sortedInsert } from "./utils";

const [episodeIdsOrderedStore, refreshOrder] = lazyRefreshableThreeState(
  getEpisodeOrder
);

export { refreshOrder };

export const queueState = derived(
  [allShowsStore, userDataEpisodesStore, episodeIdsOrderedStore],
  whenLoaded(([userDataShows, userDataEpisodes, episodeIdsOrdered]) => {
    const showsById = arrayToMap(
      userDataShows,
      ({ uniqueShowId }) => uniqueShowId
    );
    return userDataEpisodes
      .reduce((result, e) => {
        if (e.queueStatus !== EpisodeQueueStatus.Queued) return result;
        const uniqueShowid = e.uniqueShowId;
        const show = showsById[uniqueShowid];
        if (show) {
          result.insert(e.uniqueEpisodeId, e);
        } else {
          console.warn("no show", uniqueShowid);
        }
        return result;
      }, sortedInsert<Episode>(episodeIdsOrdered))
      .get();
  })
);

export async function lastPlayedEpisode() {
  return findLastPlayedEpisode(await queuedEpisodes());
}

export async function episodeAfter({
  uniqueEpisodeId,
}: {
  uniqueEpisodeId: string;
}): Promise<Episode | undefined> {
  const episodes = await queuedEpisodes();
  const indexOfEpisode = episodes.findIndex(
    (e) => e.uniqueEpisodeId === uniqueEpisodeId
  );
  return episodes[indexOfEpisode + 1];
}

export function firstEpisode(): Episode | undefined {
  const episodes = queuedEpisodes();
  return episodes[0];
}

function queuedEpisodes() {
  return waitUntilLoaded(queueState);
}

function findLastPlayedEpisode(episodes: Episode[]): Episode | undefined {
  return episodes
    .filter(
      (e) =>
        e.queueStatus === EpisodeQueueStatus.Queued && e.positionSecondsUpdated
    )
    .sort(
      (a, b) =>
        b.positionSecondsUpdated!.valueOf() -
        a.positionSecondsUpdated!.valueOf()
    )[0];
}

export async function enqueueAppleTrack(track: AppleTrack) {
  const showExists = await findShow({
    provider: Provider.Apple,
    collectionId: track.collectionId,
  });
  if (!showExists) {
    await addAppleShow(track.collectionId);
  }

  await addEpisodeOrChangeStatusToQueued({
    provider: Provider.Apple,
    track,
  });

  if (!showExists) await refreshShows();

  await refreshEpisodes();
}

async function addAppleShow(collectionId: number) {
  const collection = await fetchCollection(collectionId);
  await addShowIfNotAdded(
    { provider: Provider.Apple, collection: collection },
    new Date()
  );
}

export async function enqueueRssItem(rssFeedUrl: RssFeedUrl, item: RssItem) {
  const showExists = await findShow({
    provider: Provider.Rss,
    rssFeedUrl,
  });
  if (!showExists) {
    await addRssChannel(rssFeedUrl);
  }

  await addEpisodeOrChangeStatusToQueued({
    provider: Provider.Rss,
    rssFeedUrl,
    item,
  });

  if (!showExists) await refreshShows();

  await refreshEpisodes();
}

async function refreshEpisodes() {
  const p1 = refreshOrder();
  const p2 = refreshUserDataEpisodes();
  await p1;
  await p2;
}

async function addRssChannel(rssFeedUrl: RssFeedUrl) {
  const { items: _, ...channel } = await fetchChannel(rssFeedUrl);
  await addShowIfNotAdded(
    { provider: Provider.Rss, channel: channel, rssFeedUrl },
    new Date()
  );
}

export async function removeEpisode(episodeId: EpisodeId) {
  await removeEpisodeFromDb(episodeId, new Date());
  await refreshUserDataEpisodes();
}

type Episode = AppleEpisode | RssEpisode;
