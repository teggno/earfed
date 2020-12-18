import { writable } from "svelte/store";
import { oncer } from "./oncer";
import { providerByMapping } from "./providers/providers";
import { allShows as allShowsFromDb, status } from "./userData/shows";

async function allShows() {
  const userDataShows = await allShowsFromDb();
  const showPromises = userDataShows.map(userDataShowToShow);
  return await Promise.all(showPromises);
}

async function userDataShowToShow(userDataShow) {
  const provider = providerByMapping(userDataShow.providerMapping);
  if (!provider) {
    throw new Error(
      `could not determine provider for ${JSON.stringify(
        userDataShow.provider
      )}`
    );
  }
  const fetchedShowData = await provider.fetchShow(
    userDataShow.providerMapping
  );
  const episodeFor = (episodeProviderMapping) =>
    provider.episodeFor(episodeProviderMapping, fetchedShowData.episodes);
  return {
    showId: userDataShow.showId,
    subscribed: userDataShow.status.value === status.subscribed,
    showTitle: fetchedShowData.showTitle,
    showImageUrl: fetchedShowData.showImageUrl,
    episodeFor,
  };
}

const once = oncer();
export const allShowsStore = writable({ state: "initial", data: [] }, (set) => {
  once(() =>
    allShows().then((shows) => {
      set({ state: "loaded", data: shows });
    })
  );
  return () => {};
});

export function refreshShows() {
  allShows().then((shows) => {
    allShowsStore.set({ state: "loaded", data: shows });
  });
}
