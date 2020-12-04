import { allShowsStore } from "./showService";
import { listedEpisodes, status } from "./userData/episodes";
import { arrayToMap, sortedInsert } from "./utils";
import { derived, writable } from "svelte/store";
import { oncer } from "./oncer";
import { areEpisodesEqual } from "./episode";
import { getEpisodeOrder } from "./userData/episodeOrder";

const once1 = oncer();
const once2 = oncer();
const initial = "initial";
const loaded = "loaded";

const userDataEpisodesStore = writable({ state: initial, data: [] }, (set) => {
  once1(() =>
    listedEpisodes().then((data) => {
      set({ state: loaded, data });
    })
  );
  return () => {};
});

const episodeIdsOrderedStore = writable({ state: initial, data: [] }, (set) => {
  once2(() =>
    getEpisodeOrder().then((data) => {
      set({ state: loaded, data: data || [] });
    })
  );
  return () => {};
});

export const playlist = derived(
  [allShowsStore, userDataEpisodesStore, episodeIdsOrderedStore],
  ([shows, episodeSubscriptions, episodeIdsOrdered]) => {
    if (
      shows.state === loaded &&
      episodeSubscriptions.state === loaded &&
      episodeIdsOrdered.state === loaded
    ) {
      const showsById = arrayToMap(shows.data, (s) => showIdToString(s.showId));
      const episodeKeysOrdered = episodeIdsOrdered.data.map(episodeStringKey);
      const data = episodeSubscriptions.data
        .reduce((result, e) => {
          const show = showsById[showIdToString(e.showId)];
          if (show) {
            const providerEpisode = show.episodeFor(e.providerMapping);
            result.insert(episodeStringKey(e.episodeId), {
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
        }, sortedInsert(episodeKeysOrdered))
        .get();
      return { state: loaded, data };
    } else {
      return { state: initial, data: [] };
    }
  }
);

export function refreshPlaylist() {
  listedEpisodes().then((data) =>
    userDataEpisodesStore.set({ state: loaded, data })
  );
}

export function refreshOrder() {
  getEpisodeOrder().then((ordered) =>
    episodeIdsOrderedStore.set({ state: loaded, data: ordered || [] })
  );
}

function episodeStringKey({ provider, providerEpisodeId }) {
  return `${provider}_${providerEpisodeId}`;
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
      if (state === loaded) {
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
