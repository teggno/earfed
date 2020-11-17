import newUuid from "./newUuid";
import openUserDataDb, { episodesMetadata } from "./userDataDb";

const status = {
  deleted: "d",
  playing: "py",
  paused: "ps",
};

export async function allEpisodesNotDeleted() {
  const db = await openUserDataDb();
  return db.getAllFromIndex(
    episodesMetadata.storeName,
    episodesMetadata.indexNames.status,
    status.subscribed
  );
}

export async function addEpisodeRss(showId, { guid, episodeUrl }) {
  const episode = {
    ...newEpisode(),
    showId,
    providerMapping: { guid, episodeUrl },
  };
  await addEpisode(episode);
  return episode;
}

async function addEpisode(episode) {
  const db = await openUserDataDb();
  db.add(episodesMetadata.storeName, episode);
}

function newEpisode() {
  return {
    episodeId: newUuid(),
    status: status.paused,
    updated: new Date(),
  };
}
