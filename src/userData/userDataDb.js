import { openDB } from "idb";

export default function openUserDataDb() {
  return openDB("userData", 1, {
    upgrade(db) {
      const showSubscriptions = db.createObjectStore(
        showSubscriptionsMetadata.storeName,
        {
          keyPath: ["showId.provider", "showId.providerShowId"],
        }
      );
      showSubscriptions.createIndex(
        showSubscriptionsMetadata.indexNames.status,
        "status.value"
      ); // subscribed, unsubscribed

      const episodes = db.createObjectStore(episodesMetadata.storeName, {
        keyPath: ["episodeId.provider", "episodeId.providerEpisodeId"],
      });
      episodes.createIndex(episodesMetadata.indexNames.status, "status.value"); // listed, ended, deleted
      episodes.createIndex(episodesMetadata.indexNames.showId, [
        "showId.provider",
        "showId.providerShowId",
      ]);
    },
  });
}

export const showSubscriptionsMetadata = {
  storeName: "showSubscriptions",
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
