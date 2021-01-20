import { openDB, DBSchema, IDBPObjectStore, StoreNames } from "idb";
import type { ShowValue, ShowKeyTuple } from "./showTypes";
import type {
  EpisodeValue,
  EpisodeQueueStatus,
  EpisodeKeyTuple,
} from "./episodeTypes";
import type { EpisodeOrderValue } from "./episodeOrderTypes";

export default function openUserDataDb() {
  return openDB<UserDataDb>("userData", 1, {
    upgrade(db) {
      const shows = db.createObjectStore(showsMetadata.storeName, {
        keyPath: ["provider", "providerShowId"],
      });
      shows.createIndex(showsMetadata.indexNames.status, "status.value"); // subscribed, unsubscribed

      db.createObjectStore(episodesMetadata.storeName, {
        keyPath: ["provider", "providerEpisodeId"],
      });

      // the "episodeOrder" store contains a single item holding a sorted array
      // of episodeIds
      db.createObjectStore(episodeOrderMetadata.storeName);
    },
  });
}

const singletonKey = "there_is_only_max_one_item_here";
type SingletonKeyType = typeof singletonKey;

const shows = "shows";
type ShowsStoreName = typeof shows;

const showStatusIndexName = "status";
type ShowStatusIndexName = typeof showStatusIndexName;

export const showsMetadata = {
  storeName: <ShowsStoreName>shows,
  indexNames: {
    status: <ShowStatusIndexName>showStatusIndexName,
  },
};

const episodes = "episodes";
type EpisodesStoreName = typeof episodes;

export const episodesMetadata = {
  storeName: <EpisodesStoreName>episodes,
};

const episodeOrder = "episodeOrder";
type EpisodeOrderStoreName = typeof episodeOrder;

export const episodeOrderMetadata = {
  storeName: <EpisodeOrderStoreName>episodeOrder,
  singletonKey: <SingletonKeyType>singletonKey,
};

interface ShowsStructure {
  key: ShowKeyTuple;
  value: ShowValue;
  indexes: { status: string };
}

interface EpisodesStructure {
  key: EpisodeKeyTuple;
  value: EpisodeValue;
  indexes: {
    status: EpisodeQueueStatus;
  };
}

interface EpisodeOrderStructure {
  key: SingletonKeyType;
  value: EpisodeOrderValue;
}

interface UserDataDb extends DBSchema {
  episodeOrder: EpisodeOrderStructure;
  shows: ShowsStructure;
  episodes: EpisodesStructure;
}

type UserDataDbStore<
  T extends StoreNames<UserDataDb>,
  M extends IDBTransactionMode
> = IDBPObjectStore<UserDataDb, StoreNames<UserDataDb>[], T, M>;

export type ShowStore<M extends IDBTransactionMode> = UserDataDbStore<
  ShowsStoreName,
  M
>;
export type EpisodeStore<M extends IDBTransactionMode> = UserDataDbStore<
  EpisodeOrderStoreName,
  M
>;
export type EpisodeOrderStore<M extends IDBTransactionMode> = UserDataDbStore<
  EpisodeOrderStoreName,
  M
>;
