import { allShowsStore } from "./showService";
import { listedEpisodes, status } from "./userData/episodes";
import { arrayToMap } from "./utils";
import { derived, writable } from "svelte/store";
import { oncer } from "./oncer";
import { areEpisodesEqual } from "./episode";

const once = oncer();
const userDataEpisodes = writable({ state: "initial", data: [] }, (set) => {
  once(() =>
    listedEpisodes().then((e) => {
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
            episodeId: e.episodeId,
            positionSeconds: e.positionSeconds,
            status: e.status,
            showImageUrl: show.showImageUrl,
            showTitle: show.showTitle,
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
  listedEpisodes().then((data) =>
    userDataEpisodes.set({ state: "loaded", data })
  );
}

export function lastPlayedEpisode() {
  return playlistEpisodes().then(findLastPlayedEpisode);
}

export async function episodeAfter(episode) {
  const episodes = await playlistEpisodes();
  const indexOfEpisode = episodes.findIndex((e) =>
    areEpisodesEqual(e, episode)
  );
  return episodes[indexOfEpisode + 1];
}

function playlistEpisodes() {
  let unsubscribe;
  return new Promise((resolve) => {
    unsubscribe = playlist.subscribe(({ state, data }) => {
      if (state === "loaded") {
        resolve(data);
      }
    });
  }).finally(() => {
    unsubscribe();
  });
}

function findLastPlayedEpisode(episodes) {
  return episodes
    .filter((e) => e.status.value === status.listed && e.positionSeconds)
    .sort(
      (a, b) =>
        b.positionSeconds.updated.valueOf() -
        a.positionSeconds.updated.valueOf()
    )[0];
}

function showIdToString(showId) {
  return `${showId.provider}_${showId.providerShowId}`;
}
