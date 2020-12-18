import { openDB } from "idb";

export default function openUserDataDb() {
  return openDB("userData", 1, {
    upgrade(db) {
      const shows = db.createObjectStore(showsMetadata.storeName, {
        keyPath: ["showId.provider", "showId.providerShowId"],
      });
      shows.createIndex(showsMetadata.indexNames.status, "status.value"); // subscribed, unsubscribed

      const episodes = db.createObjectStore(episodesMetadata.storeName, {
        keyPath: ["episodeId.provider", "episodeId.providerEpisodeId"],
      });
      episodes.createIndex(episodesMetadata.indexNames.status, "status.value"); // listed, ended, deleted
      episodes.createIndex(episodesMetadata.indexNames.showId, [
        "showId.provider",
        "showId.providerShowId",
      ]);

      // the "episodeOrder" store contains a single item holding a sorted array
      // of episodeId's
      db.createObjectStore(episodeOrderMetadata.storeName);
    },
  });
}

export const showsMetadata = {
  storeName: "shows",
  indexNames: {
    status: "status",
  },
};

export const episodesMetadata = {
  storeName: "episodes",
  indexNames: {
    status: "status",
    showId: "showId",
  },
};

export const episodeOrderMetadata = {
  storeName: "episodeOrder",
  singletonKey: "there_is_only_max_one_item_here",
};
