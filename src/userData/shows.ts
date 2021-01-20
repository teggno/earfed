import { Provider } from "../providers";
import {
  AppleCollection,
  AppleCollectionId,
  RssChannel,
  RssFeedUrl,
  ShowId,
  ShowStatus,
} from "./showTypes";
import openUserDataDb, { showsMetadata } from "./userDataDb";

export async function allShows() {
  const db = await openUserDataDb();
  const showValues = await db.getAll(showsMetadata.storeName);
  return showValues.map((s) => {
    if (s.provider === Provider.Apple) {
      const { providerShowId, ...show } = s;
      return show;
    } else {
      const { providerShowId, ...show } = s;
      return { ...show, rssFeedUrl: providerShowId };
    }
  });
}

export async function findShow(showId: ShowId) {
  const db = await openUserDataDb();
  return await db.get(
    showsMetadata.storeName,
    showId.provider === Provider.Apple
      ? [Provider.Apple, showId.collectionId]
      : [Provider.Rss, showId.rssFeedUrl]
  );
}

export async function addShowIfNotAdded(show: ShowInput, date: Date) {
  const db = await openUserDataDb();
  const tran = db.transaction(showsMetadata.storeName, "readwrite");

  const existingShow = await tran.store.get(
    show.provider === Provider.Apple
      ? [Provider.Apple, show.collection.collectionId]
      : [Provider.Rss, show.rssFeedUrl]
  );
  if (!existingShow) {
    await tran.store.add(
      showInputToShowValue(show, date, ShowStatus.NotSubscribed)
    );
  }
  return tran.done.then(() => ({ show, added: !existingShow }));
}

export async function subscribeToShow(show: ShowInput, date: Date) {
  const db = await openUserDataDb();
  await db.put(
    showsMetadata.storeName,
    showInputToShowValue(show, date, ShowStatus.Subscribed)
  );
  return show;
}

export interface AppleShowInput {
  provider: Provider.Apple;
  collection: AppleCollection;
}

export interface RssShowInput {
  provider: Provider.Rss;
  rssFeedUrl: RssFeedUrl;
  channel: RssChannel;
}

export type ShowInput = AppleShowInput | RssShowInput;

export async function unsubscribeFromShow(showId: ShowId, date: Date) {
  const db = await openUserDataDb();
  const tran = db.transaction(showsMetadata.storeName, "readwrite");
  const show = await tran.store.get(showIdToTuple(showId));
  if (!show) {
    console.warn("tried to unsubscribe from non existing show", showId);
    return;
  }
  show.status = { value: ShowStatus.NotSubscribed, updated: date };
  await tran.store.put(show);
  await tran.done;
}

function showIdToTuple(showId: ShowId) {
  return showId.provider === Provider.Apple
    ? ([showId.provider, showId.collectionId] as [Provider.Apple, number])
    : ([showId.provider, showId.rssFeedUrl] as [Provider.Rss, string]);
}

function showInputToShowValue(
  showInput: ShowInput,
  updated: Date,
  showStatus: ShowStatus
) {
  return showInput.provider == Provider.Apple
    ? {
        provider: Provider.Apple as Provider.Apple,
        providerShowId: showInput.collection.collectionId,
        status: { value: showStatus, updated },
        collection: { value: showInput.collection, updated },
      }
    : {
        provider: Provider.Rss as Provider.Rss,
        providerShowId: showInput.rssFeedUrl,
        status: { value: showStatus, updated },
        channel: { value: showInput.channel, updated },
      };
}
