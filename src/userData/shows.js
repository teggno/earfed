import openUserDataDb, { showsMetadata } from "./userDataDb";

export const status = {
  subscribed: "s",
  notSubscribed: "u",
};

export async function allShows() {
  const db = await openUserDataDb();
  return db.getAll(showsMetadata.storeName);
}

export async function addShowIfNotAdded(
  provider,
  providerShowId,
  providerMapping,
  date
) {
  const db = await openUserDataDb();
  const tran = db.transaction(showsMetadata.storeName, "readwrite");

  let show = await tran.store.get(makeShowIdForGet(provider, providerShowId));
  const added = !show;
  if (!show) {
    show = {
      showId: makeShowId(provider, providerShowId),
      status: { value: status.notSubscribed, updated: date },
      providerMapping,
    };
    await tran.store.put(show);
  }
  return tran.done.then(() => ({ show, added }));
}

export async function subscribeToShow(
  provider,
  providerShowId,
  providerMapping,
  date
) {
  const show = {
    status: { value: status.subscribed, updated: date },
    showId: makeShowId(provider, providerShowId),
    providerMapping,
  };
  const db = await openUserDataDb();
  await db.put(showsMetadata.storeName, show);
  return show;
}

export async function unsubscribeFromShow(showId, date) {
  const db = await openUserDataDb();
  const tran = db.transaction(showsMetadata.storeName, "readwrite");
  const show = await tran.store.get(makeShowIdForGet(showId));
  if (!show) {
    console.warn("tried to unsubscribe from non existing show", showId);
    return;
  }
  show.status = { value: status.notSubscribed, date: date };
  await tran.store.put(show);
  await tran.done;
}

function makeShowId(provider, providerShowId) {
  return { provider, providerShowId };
}

function makeShowIdForGet(provider, providerShowId) {
  return [provider, providerShowId];
}
