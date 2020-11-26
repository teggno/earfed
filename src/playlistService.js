import { allShowsStore } from "./showService";
import { allEpisodesNotDeleted } from "./userData/episodes";
import { arrayToMap } from "./utils";
import { derived, writable } from "svelte/store";
import { oncer } from "./oncer";

const once = oncer();
const userDataEpisodes = writable({ state: "initial", data: [] }, (set) => {
  once(() =>
    allEpisodesNotDeleted().then((e) => {
      set({ state: "loaded", data: e });
    })
  );
  return () => {};
});

export const playlist = derived(
  [allShowsStore, userDataEpisodes],
  ([shows, episodeSubscriptions]) => {
    if (shows.state === "loaded" && episodeSubscriptions.state === "loaded") {
      const showsById = arrayToMap(shows.data, (s) => showIdToString(s.showId));

      const data = episodeSubscriptions.data.reduce((result, e) => {
        const show = showsById[showIdToString(e.showId)];
        if (show) {
          const providerEpisode = show.episodeFor(e.providerMapping);
          result.push({
            showImageUrl: show.showImageUrl,
            showTitle: show.showTitle,
            episodeId: e.episodeId,
            positionSeconds: e.positionSeconds,
            status: e.status,
            ...providerEpisode,
          });
        } else {
          console.warn("no show", e.showId);
        }
        return result;
      }, []);
      return { state: "loaded", data };
    } else {
      return { state: "initial", data: [] };
    }
  }
);

export function refreshPlaylist() {
  allEpisodesNotDeleted().then((data) =>
    userDataEpisodes.set({ state: "loaded", data })
  );
}

function showIdToString(showId) {
  return `${showId.provider}_${showId.providerShowId}`;
}
