import { openDB } from "idb";

export default function openUserDataDb() {
  return openDB("userData", 1, {
    upgrade(db) {
      const showSubscriptions = db.createObjectStore(
        showSubscriptionsMetadata.storeName,
        {
          keyPath: "showId",
        }
      );
      showSubscriptions.createIndex(
        showSubscriptionsMetadata.indexNames.status,
        "status"
      ); // subscribed, unsubscribed

      const episodes = db.createObjectStore(episodesMetadata.storeName, {
        keyPath: "episodeId",
      });
      episodes.createIndex(episodesMetadata.indexNames.status, "status"); // playing, paused, deleted
      episodes.createIndex(episodesMetadata.indexNames.showId, "showId");
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
