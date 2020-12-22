import { addEpisodesToEnd, removeEpisodeOrder } from "./episodeOrder";
import openUserDataDb, {
  episodeOrderMetadata,
  episodesMetadata,
} from "./userDataDb";

export const status = {
  listed: "l",
  ended: "e",
  deleted: "d",
};

export async function queryListedEpisodes() {
  const db = await openUserDataDb();
  return db.getAllFromIndex(
    episodesMetadata.storeName,
    episodesMetadata.indexNames.status,
    status.listed
  );
}

/**
 * @param {Object[]} episodes
 * @param {string} episodes[].providerEpisodeId
 * @param {Object} episodes[].showId
 * @param {Object} episodes[].providerMapping
 */
export async function addEpisodes(episodes, date) {
  const db = await openUserDataDb();
  const tran = db.transaction(
    [episodesMetadata.storeName, episodeOrderMetadata.storeName],
    "readwrite"
  );
  const episodesForStore = episodes.map(
    ({ providerEpisodeId, showId, providerMapping }) => ({
      episodeId: {
        provider: showId.provider,
        providerEpisodeId,
      },
      showId,
      status: { value: status.listed, updated: date },
      providerMapping,
    })
  );
  try {
    const episodeStore = tran.objectStore(episodesMetadata.storeName);
    const orderStore = tran.objectStore(episodeOrderMetadata.storeName);
    await Promise.all(episodesForStore.map((e) => episodeStore.add(e)));
    const episodeIds = episodesForStore.map((e) => e.episodeId);
    await addEpisodesToEnd(orderStore, episodeIds, date);
  } catch (e) {
    console.error(e);
    tran.abort();
    // no need to re-throw because tran.abort() kind of does that already.
  }
  return tran.done;
}

export async function updatePositionSeconds(episodeId, positionSeconds, date) {
  const db = await openUserDataDb();
  const tran = db.transaction(episodesMetadata.storeName, "readwrite");
  const episode = await tran.store.get([
    episodeId.provider,
    episodeId.providerEpisodeId,
  ]);
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

export function setEpisodeEnded(episodeId, date) {
  return endOrRemove(episodeId, status.ended, date);
}

export function removeEpisode(episodeId, date) {
  return endOrRemove(episodeId, status.deleted, date);
}

async function endOrRemove(episodeId, newStatus, date) {
  const db = await openUserDataDb();
  const tran = db.transaction(
    [episodesMetadata.storeName, episodeOrderMetadata.storeName],
    "readwrite"
  );
  const episodeStore = tran.objectStore(episodesMetadata.storeName);
  const orderStore = tran.objectStore(episodeOrderMetadata.storeName);
  const episode = await episodeStore.get([
    episodeId.provider,
    episodeId.providerEpisodeId,
  ]);
  if (!episode.status || episode.status.updated < date) {
    episode.status = { value: newStatus, updated: date };
    try {
      await episodeStore.put(episode);
      await removeEpisodeOrder(orderStore, episodeId, date);
    } catch (e) {
      console.error(e);
      tran.abort();
    }
  } else {
    console.warn("not updating status because there's a newer value already");
  }
  return tran.done;
}
