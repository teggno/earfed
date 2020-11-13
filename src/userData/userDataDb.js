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
    },
  });
}

export const showSubscriptionsMetadata = {
  storeName: "showSubscriptions",
  indexNames: {
    status: "status",
  },
};
