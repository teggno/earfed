import { allShowsStore, refreshShows } from "./showService";
import {
  addEpisodes,
  status,
  removeEpisode as removeEpisodeFromDb,
} from "./userData/episodes";
import { arrayToMap, sortedInsert } from "./utils";
import { derived, writable } from "svelte/store";
import { oncer } from "./oncer";
import { areEpisodesEqual } from "./episode";
import { getEpisodeOrder } from "./userData/episodeOrder";
import { addShowIfNotAdded } from "./userData/shows";
import { initial, loaded } from "./threeState";
import {
  userDataEpisodesStore,
  refreshUserDataEpisodes,
} from "./episodeService";

const once = oncer();

const episodeIdsOrderedStore = writable({ state: initial, data: [] }, (set) => {
  once(() =>
    getEpisodeOrder().then((data) => {
      set({ state: loaded, data: data || [] });
    })
  );
  return () => {};
});

export const queueState = derived(
  [allShowsStore, userDataEpisodesStore, episodeIdsOrderedStore],
  ([shows, listedEpisodes, episodeIdsOrdered]) => {
    if (
      shows.state === loaded &&
      listedEpisodes.state === loaded &&
      episodeIdsOrdered.state === loaded
    ) {
      const showsById = arrayToMap(shows.data, (s) => showIdToString(s.showId));
      const episodeKeysOrdered = episodeIdsOrdered.data.map(episodeStringKey);
      const data = listedEpisodes.data
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

export function refreshOrder() {
  getEpisodeOrder().then((ordered) =>
    episodeIdsOrderedStore.set({ state: loaded, data: ordered || [] })
  );
}

function episodeStringKey({ provider, providerEpisodeId }) {
  return `${provider}_${providerEpisodeId}`;
}

export function lastPlayedEpisode() {
  return queueEpisodes().then(findLastPlayedEpisode);
}

export async function episodeAfter(episode) {
  const episodes = await queueEpisodes();
  const indexOfEpisode = episodes.findIndex((e) =>
    areEpisodesEqual(e, episode)
  );
  return episodes[indexOfEpisode + 1];
}

export async function firstEpisode() {
  const episodes = await queueEpisodes();
  return episodes[0];
}

function queueEpisodes() {
  let unsubscribe;
  return new Promise((resolve) => {
    unsubscribe = queueState.subscribe(({ state, data }) => {
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

export async function enqueue(showRecord, episodeRecord) {
  const now = new Date();

  const { added: showAdded } = await addShowIfNotAdded(
    showRecord.provider,
    showRecord.providerShowId,
    showRecord.providerMapping,
    now
  );
  // TODO: Only add if not already added. Change status from deleted or ended to
  // listed if already exists and status isn't listed. Currently an error is thrown
  // when trying to enqueue an episode that already exists.
  await addEpisodes(
    [
      {
        ...episodeRecord,
        showId: {
          provider: showRecord.provider,
          providerShowId: showRecord.providerShowId,
        },
      },
    ],
    now
  );

  if (showAdded) {
    await refreshShows();
  }
  await refreshUserDataEpisodes();
}

export async function removeEpisode(episodeId) {
  await removeEpisodeFromDb(episodeId, new Date());
  await refreshUserDataEpisodes();
}
