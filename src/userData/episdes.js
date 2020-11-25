import openUserDataDb, { episodesMetadata } from "./userDataDb";

const status = {
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
