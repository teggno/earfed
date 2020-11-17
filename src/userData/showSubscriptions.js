import newUuid from "./newUuid";
import openUserDataDb, { showSubscriptionsMetadata } from "./userDataDb";

const status = {
  subscribed: "s",
  unsubscribed: "u",
};

export async function allShowSubscriptions() {
  const db = await openUserDataDb();
  return db.getAllFromIndex(
    showSubscriptionsMetadata.storeName,
    showSubscriptionsMetadata.indexNames.status,
    status.subscribed
  );
}

export async function subscribeToShow(providerMapping) {
  const show = { ...newShow(), providerMapping };
  const db = await openUserDataDb();
  await db.add(showSubscriptionsMetadata.storeName, show);
  return show;
}

export async function unsubscribeFromShow(showId) {
  const db = await openUserDataDb();
  const tran = db.transaction(showSubscriptionsMetadata.storeName, "readwrite");
  const show = await tran.store.get(showId);
  if (!show) {
    console.warn("tried to unsubscribe from non existing show", showId);
    return;
  }
  show.status = status.unsubscribed;
  await tran.store.put(show);
  await tran.done;
}

function newShow() {
  return {
    showId: newUuid(),
    status: status.subscribed,
    updated: new Date(),
  };
}
