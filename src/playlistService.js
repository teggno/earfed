import { allShowsStore } from "./showService";
import { allEpisodesNotDeleted } from "./userData/episdes";
import { arrayToMap } from "./utils";
import { derived, writable } from "svelte/store";
import { oncer } from "./oncer";

const once = oncer();
const userDataEpisodes = writable([], (set) => {
  once(() => allEpisodesNotDeleted().then(set));
  return () => {};
});

export const playlist = derived(
  [allShowsStore, userDataEpisodes],
  ([shows, episodeSubscriptions]) => {
    const showsById = arrayToMap(shows, (s) => showIdToString(s.showId));

    return episodeSubscriptions.reduce((result, e) => {
      const show = showsById[showIdToString(e.showId)];
      if (show) {
        const episode = show.episodeFor(e.providerMapping);
        result.push({
          showImageUrl: show.showImageUrl,
          showTitle: show.showTitle,
          episodeId: e.episodeId,
          ...episode,
        });
      } else {
        console.warn("no show", e.showId);
      }
      return result;
    }, []);
  }
);

export function refreshPlaylist() {
  allEpisodesNotDeleted().then(userDataEpisodes.set);
}

function showIdToString(showId) {
  return `${showId.provider}_${showId.providerShowId}`;
}
