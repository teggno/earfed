import { writable } from "svelte/store";
import { oncer } from "./oncer";
import { providerByMapping } from "./providers/providers";
import { allShowSubscriptions } from "./userData/showSubscriptions";

async function allShows() {
  const userDataShows = await allShowSubscriptions();
  const showPromises = userDataShows.map((ss) => showSubscriptionToShow(ss));
  return await Promise.all(showPromises);
}

async function showSubscriptionToShow(showSubscription) {
  const provider = providerByMapping(showSubscription.providerMapping);
  if (!provider) {
    throw new Error(
      `could not determine provider for ${JSON.stringify(
        showSubscription.providerM
      )}`
    );
  }
  const fetchedShowData = await provider.fetchShow(
    showSubscription.providerMapping
  );
  const episodeFor = (episodeProviderMapping) =>
    provider.episodeFor(episodeProviderMapping, fetchedShowData.episodes);
  return {
    showId: showSubscription.showId,
    showTitle: fetchedShowData.showTitle,
    showImageUrl: fetchedShowData.showImageUrl,
    episodeFor,
  };
}

const once = oncer();
export const allShowsStore = writable([], (set) => {
  once(() => allShows().then(set));
  return () => {};
});

export function refreshShows() {
  allShows().then(allShowsStore.set);
}
