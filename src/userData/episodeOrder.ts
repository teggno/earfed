import openUserDataDb, {
  episodeOrderMetadata,
  EpisodeOrderStore,
} from "./userDataDb";
import type { EpisodeOrderValue, UniqueEpisodeId } from "./episodeOrderTypes";

const key = episodeOrderMetadata.singletonKey;

export async function getEpisodeOrder() {
  const db = await openUserDataDb();
  const store = db.transaction(episodeOrderMetadata.storeName, "readonly")
    .store;
  const found = await getEpisodeOrderInternal(store);
  return found?.value ?? [];
}

export async function addEpisodesToEnd(
  store: EpisodeOrderStore,
  episodeIdsOrdered: UniqueEpisodeId[],
  date: Date
) {
  const existing = await getEpisodeOrderInternal(store);
  if (existing) {
    if (existing.updated > date) {
      throwConcurrencyError();
    }
  }
  return putEpisodeOrderInternal(
    store,
    existing ? [...existing.value, ...episodeIdsOrdered] : episodeIdsOrdered,
    date
  );
}

export async function removeEpisodeOrder(
  store: EpisodeOrderStore,
  uniqueEpisodeId: UniqueEpisodeId,
  date: Date
) {
  const existing = await getEpisodeOrderInternal(store);
  if (!existing) {
    console.warn(
      "tried to remove episode from order but no order has previously been saved",
      uniqueEpisodeId
    );
    return;
  }

  if (existing.updated > date) {
    throwConcurrencyError();
  }

  const newList = existing.value.filter((e) => e !== uniqueEpisodeId);
  return putEpisodeOrderInternal(store, newList, date);
}

export async function putEpisodeOrder(episodeIdsOrdered: UniqueEpisodeId[]) {
  const db = await openUserDataDb();
  const store = db.transaction(episodeOrderMetadata.storeName, "readwrite")
    .store;
  return putEpisodeOrderInternal(store, episodeIdsOrdered, new Date());
}

function getEpisodeOrderInternal(
  store: EpisodeOrderStore
): Promise<EpisodeOrderValue | undefined> {
  return store.get(key);
}

function putEpisodeOrderInternal(
  store: EpisodeOrderStore,
  episodeIdsOrdered: UniqueEpisodeId[],
  date: Date
) {
  return store.put({ value: episodeIdsOrdered, updated: date }, key);
}

function throwConcurrencyError() {
  throw new Error("queue order has already been saved more recently");
}
