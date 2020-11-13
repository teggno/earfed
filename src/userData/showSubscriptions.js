import { fetchShowRssFeed } from "../showRssFeed";
import newUuid from "./newUuid";
import openUserDataDb, { showSubscriptionsMetadata } from "./userDataDb";

const status = {
  subscribed: "s",
  unsubscribed: "u",
};

export async function allShowSubscriptions() {
  const db = await openUserDataDb();
  const showsRaw = await db.getAllFromIndex(
    showSubscriptionsMetadata.storeName,
    showSubscriptionsMetadata.indexNames.status,
    status.subscribed
  );
  return showsRaw.map(({ apple, rss, ...rest }) => {
    if (apple) {
      return { ...rest, fetchShow: () => fetchShowApple(apple.collectionId) };
    } else if (rss) {
      return { ...rest, fetchShow: () => fetchShowRssFeed(rss.showRssFeedUrl) };
    } else {
      throw new Error("Unexpected show that has neither rss nor apple info");
    }
  });
}

export async function subscribeToShowApple(collectionId) {
  const show = { ...newShow(), apple: { collectionId } };
  await subscribeToShow(show);
  return show;
}

export async function subscribeToShowRss(showRssFeedUrl) {
  const show = { ...newShow(), rss: { showRssFeedUrl } };
  await subscribeToShow(show);
  return show;
}

async function subscribeToShow(show) {
  const db = await openUserDataDb();
  await db.add(showSubscriptionsMetadata.storeName, show);
}

function newShow() {
  return {
    showId: newUuid(),
    status: status.subscribed,
    updated: new Date(),
  };
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

function fetchShowApple(collectionId) {}
