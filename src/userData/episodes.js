import openUserDataDb, { episodesMetadata } from "./userDataDb";

export const status = {
  listed: "l",
  ended: "e",
  deleted: "d",
};

export async function allEpisodesNotDeleted() {
  const db = await openUserDataDb();
  return db.getAllFromIndex(
    episodesMetadata.storeName,
    episodesMetadata.indexNames.status,
    status.subscribed
  );
}

export async function addEpisode(providerEpisodeId, showId, providerMapping) {
  const episode = {
    ...newEpisode(),
    episodeId: {
      provider: showId.provider,
      providerEpisodeId,
    },
    showId,
    providerMapping,
  };
  const db = await openUserDataDb();
  await db.add(episodesMetadata.storeName, episode);
  return episode;
}

function newEpisode() {
  return {
    status: { value: status.listed, updated: new Date() },
  };
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
