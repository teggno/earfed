import { areEpisodeIdsEqual } from "../episode";
import openUserDataDb, { episodeOrderMetadata } from "./userDataDb";

const key = episodeOrderMetadata.singletonKey;

// export async function saveEpisodeOrder(episodeIdsOrdered) {
//   const db = await openUserDataDb();
//   const tran = db.transaction(episodeOrderMetadata.storeName, "readwrite");
//   await put(tran.store, episodeIdsOrdered, new Date());
// }

export async function getEpisodeOrder() {
  const db = await openUserDataDb();
  const store = db.transaction(episodeOrderMetadata.storeName, "readonly")
    .store;
  const found = await getEpisodeOrderInternal(store);
  return found ? found.value : undefined;
}

export async function addEpisodesToEnd(store, episodeIdsOrdered, date) {
  const existing = await getEpisodeOrderInternal(store);
  if (existing) {
    if (existing.date > date) {
      throwConcurrencyError();
    }
  }
  return putEpisodeOrderInternal(
    store,
    existing ? [...existing, ...episodeIdsOrdered] : episodeIdsOrdered,
    date
  );
}

export async function removeEpisodeOrder(store, episodeId, date) {
  const existing = await getEpisodeOrderInternal(store);
  if (!existing) {
    console.warn(
      "tried to remove episode from order but no order has previously been saved",
      episodeId
    );
    return;
  }

  if (existing.date > date) {
    throwConcurrencyError();
  }

  const newList = existing.value.filter(
    (e) => !areEpisodeIdsEqual(e, episodeId)
  );
  return putEpisodeOrderInternal(store, newList, date);
}

export async function putEpisodeOrder(episodeIdsOrdered) {
  const db = await openUserDataDb();
  const store = db.transaction(episodeOrderMetadata.storeName, "readwrite")
    .store;
  return putEpisodeOrderInternal(store, episodeIdsOrdered, new Date());
}

function getEpisodeOrderInternal(store) {
  return store.get(key);
}

function putEpisodeOrderInternal(store, episodeIdsOrdered, date) {
  return store.put({ value: episodeIdsOrdered, updated: date }, key);
}

function throwConcurrencyError() {
  throw new Error("queue order has already been saved more recently");
}
