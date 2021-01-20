import {
  Provider,
  appleUniqueEpisodeId,
  rssUniqueEpisodeId,
} from "../providers";
import { addEpisodesToEnd, removeEpisodeOrder } from "./episodeOrder";
import {
  AppleEpisodeValue,
  AppleTrack,
  EpisodeQueueStatus,
  RssEpisodeValue,
  RssItem,
  EpisodeId,
} from "./episodeTypes";
import type { RssFeedUrl } from "./showTypes";
import openUserDataDb, {
  episodeOrderMetadata,
  episodesMetadata,
} from "./userDataDb";

export async function allEpisodes() {
  const db = await openUserDataDb();
  const episodeValues = await db.getAll(episodesMetadata.storeName);
  return episodeValues.map((e) => {
    if (e.provider === Provider.Apple) {
      const { providerEpisodeId, ...episode } = e;
      return episode;
    } else {
      const { providerEpisodeId, ...episode } = e;
      return episode;
    }
  });
}

export async function addEpisodeOrChangeStatusToQueued(
  input: AppleEpisodeInput | RssEpisodeInput
) {
  const db = await openUserDataDb();
  const tran = db.transaction(
    [episodesMetadata.storeName, episodeOrderMetadata.storeName],
    "readwrite"
  );
  try {
    const date = new Date();
    const episodeStore = tran.objectStore(episodesMetadata.storeName);
    const orderStore = tran.objectStore(episodeOrderMetadata.storeName);

    const episodeId =
      input.provider === Provider.Apple
        ? createAppleEpisodeId(input.track)
        : createRssEpisodeId(input.item);
    let episodeValue = await episodeStore.get(episodeIdToTuple(episodeId));

    if (episodeValue?.status.value === EpisodeQueueStatus.Queued) {
      return tran.done;
    }

    if (episodeValue) {
      episodeValue.status = {
        value: EpisodeQueueStatus.Queued,
        updated: date,
      };
      episodeValue.positionSeconds = {
        value: 0,
        updated: date,
      };
    } else {
      episodeValue = episodeInputToEpisodeValue(
        input,
        date,
        EpisodeQueueStatus.Queued
      );
    }

    await episodeStore.put(episodeValue);
    await addEpisodesToEnd(orderStore, [episodeIdToUniqueId(episodeId)], date);
  } catch (e) {
    console.error(e);
    tran.abort();
    // no need to re-throw because tran.abort() kind of does that already.
  }
  return tran.done;
}

export async function updatePositionSeconds(
  episodeId: EpisodeId,
  positionSeconds: number,
  date: Date
) {
  const db = await openUserDataDb();
  const tran = db.transaction(episodesMetadata.storeName, "readwrite");
  const episode = await tran.store.get(episodeIdToTuple(episodeId));
  if (!episode) return;

  if (!episode.positionSeconds || episode.positionSeconds.updated < date) {
    episode.positionSeconds = { value: positionSeconds, updated: date };
    await tran.store.put(episode);
  } else {
    console.warn(
      "not updating positionSeconds because there's a newer value already"
    );
  }
  return episode;
}

export function setEpisodeEnded(episodeId: EpisodeId, date: Date) {
  return endOrRemove(episodeId, EpisodeQueueStatus.Ended, date);
}

export function removeEpisode(episodeId: EpisodeId, date: Date) {
  return endOrRemove(episodeId, EpisodeQueueStatus.Deleted, date);
}

async function endOrRemove(
  episodeId: EpisodeId,
  newStatus: EpisodeQueueStatus.Ended | EpisodeQueueStatus.Deleted,
  date: Date
) {
  const db = await openUserDataDb();
  const tran = db.transaction(
    [episodesMetadata.storeName, episodeOrderMetadata.storeName],
    "readwrite"
  );
  const episodeStore = tran.objectStore(episodesMetadata.storeName);
  const orderStore = tran.objectStore(episodeOrderMetadata.storeName);
  const episode = await episodeStore.get(episodeIdToTuple(episodeId));
  if (!episode) return;

  if (!episode.status || episode.status.updated < date) {
    episode.status = { value: newStatus, updated: date };
    try {
      await episodeStore.put(episode);
      await removeEpisodeOrder(
        orderStore,
        episodeIdToUniqueId(episodeId),
        date
      );
    } catch (e) {
      console.error(e);
      tran.abort();
    }
  } else {
    console.warn(
      "not updating episode's queue status because there's a newer value already"
    );
  }
  return tran.done;
}

function episodeIdToTuple(episodeId: EpisodeId) {
  const tupleReadonly =
    episodeId.provider === Provider.Apple
      ? ([episodeId.provider, episodeId.trackId] as const)
      : ([episodeId.provider, episodeId.guid] as const);
  return tupleReadonly as NotReadonly<typeof tupleReadonly>;
}

function episodeIdToUniqueId(episodeId: EpisodeId) {
  return episodeId.provider === Provider.Apple
    ? appleUniqueEpisodeId(episodeId.trackId)
    : rssUniqueEpisodeId(episodeId.guid);
}

function episodeInputToEpisodeValue(
  episodeInput: EpisodeInput,
  updated: Date,
  queueStatus: EpisodeQueueStatus
) {
  return episodeInput.provider === Provider.Apple
    ? appleEpisodeInputToAppleEpisodeValue(episodeInput, updated, queueStatus)
    : rssEpisodeInputToRssEpisodeValue(episodeInput, updated, queueStatus);
}

function appleEpisodeInputToAppleEpisodeValue(
  episodeInput: AppleEpisodeInput,
  updated: Date,
  queueStatus: EpisodeQueueStatus
): AppleEpisodeValue {
  return {
    provider: episodeInput.provider,
    providerEpisodeId: episodeInput.track.trackId,
    collectionId: episodeInput.track.collectionId,
    track: { value: episodeInput.track, updated },
    status: { value: queueStatus, updated },
  };
}

function rssEpisodeInputToRssEpisodeValue(
  episodeInput: RssEpisodeInput,
  updated: Date,
  queueStatus: EpisodeQueueStatus
): RssEpisodeValue {
  return {
    provider: episodeInput.provider,
    providerEpisodeId: episodeInput.item.guid,
    rssFeedUrl: episodeInput.rssFeedUrl,
    item: { value: episodeInput.item, updated },
    status: { value: queueStatus, updated },
  };
}

function createAppleEpisodeId({ trackId }: { trackId: number }) {
  return {
    provider: Provider.Apple as Provider.Apple,
    trackId,
  };
}

function createRssEpisodeId({ guid }: { guid: string }) {
  return { provider: Provider.Rss as Provider.Rss, guid };
}

export type EpisodeInput = AppleEpisodeInput | RssEpisodeInput;

type NotReadonly<T> = { -readonly [P in keyof T]: T[P] };

interface AppleEpisodeInput {
  provider: Provider.Apple;
  track: AppleTrack;
}

interface RssEpisodeInput {
  provider: Provider.Rss;
  rssFeedUrl: RssFeedUrl;
  item: RssItem;
}
