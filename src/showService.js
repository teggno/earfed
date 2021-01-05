import { derived } from "svelte/store";
import { oncer } from "./oncer";
import { providerByMapping } from "./providers/providers";
import {
  loaded,
  makeError,
  makeLoaded,
  writableThreeState,
} from "./threeState";
import {
  allShows as allShowsFromDb,
  status,
  subscribeToShow as subscribeToShowInDb,
  unsubscribeFromShow as unsubscribeFromShowInDb,
} from "./userData/shows";

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
    artistName: fetchedShowData.artistName,
    subscribedShowUrl: fetchedShowData.subscribedShowUrl,
    episodeFor,
  };
}

const once = oncer();
export const userDataShowsState = writableThreeState((set) => {
  once(() =>
    allShowsFromDb().then((data) => {
      set(makeLoaded(data));
    })
  );
});

export function refreshShows() {
  return allShowsFromDb().then((data) => {
    userDataShowsState.setLoaded(data);
  });
}

export const allShowsStore = derived(
  userDataShowsState,
  (userDataShows, set) => {
    if (userDataShows.state === loaded) {
      Promise.all(userDataShows.data.map(userDataShowToShow))
        .then((shows) => {
          set(makeLoaded(shows));
        })
        .catch((err) => set(makeError(err)));
    } else {
      set(userDataShows);
    }
  }
);

export async function subscribeToShow({
  provider,
  providerShowId,
  providerMapping,
}) {
  await subscribeToShowInDb(
    provider,
    providerShowId,
    providerMapping,
    new Date()
  );
  refreshShows();
}

export async function unsubscribeFromShow(showId) {
  await unsubscribeFromShowInDb(showId, new Date());
  refreshShows();
}
