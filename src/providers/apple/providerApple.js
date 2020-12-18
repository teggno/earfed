import { lookupEpisodes, lookupShow } from "./api";
import {
  subscribeToShow as subscribeInDb,
  addShowIfNotAdded as addShowIfNotAddedToDb,
} from "../../userData/shows";
import { addEpisodes as addEpisodesTodb } from "../../userData/episodes";

export const apple = "apple";

export function providerFor(showProviderMapping) {
  return typeof showProviderMapping.collectionId !== "undefined";
}

export async function fetchShow({ collectionId }) {
  return Promise.all([
    lookupShow(collectionId),
    lookupEpisodes(collectionId),
  ]).then(([appleShow, appleEpisodes]) => ({
    ...appleShowToShow(appleShow),
    episodes: appleEpisodes.map(appleEpisodeToEpisode),
  }));
}

function appleShowToShow(appleShow) {
  return {
    showTitle: appleShow.collectionName,
    showImageUrl: appleShow.artworkUrl60,
    categories: appleShow.genres,
  };
}

function appleEpisodeToEpisode(appleEpisode) {
  return {
    ...appleEpisode,
    episodeTitle: appleEpisode.trackName,
    pubDate: new Date(appleEpisode.releaseDate),
    episodeDescription: {
      type: "html",
      value: appleEpisode.description
        .replace(/\n/g, "<br/>")
        .replace(
          /\t/g,
          '<span style="display:inline-block;width: 10px;"></span>'
        ),
    },
    durationSeconds: appleEpisode.trackTimeMillis / 1000,
  };
}

export function subscribeToShow(collectionId, date) {
  return subscribeInDb(
    apple,
    collectionId,
    makeProviderMapping(collectionId),
    date
  );
}

export async function queueEpisode({ collectionId, trackId }) {
  const { showId } = await addShowIfNotAdded(collectionId);
  await addEpisodes(showId, [{ trackId }], new Date());
}

export function addShowIfNotAdded(collectionId, date) {
  return addShowIfNotAddedToDb(
    apple,
    collectionId,
    makeProviderMapping(collectionId),
    date
  );
}

function makeProviderMapping(collectionId) {
  return { collectionId };
}

export function addEpisodes(showId, episodes, date) {
  const payload = episodes.map((episode) => ({
    providerEpisodeId: episode.trackId,
    showId,
    providerMapping: { trackId: episode.trackId.toString() },
  }));

  return addEpisodesTodb(payload, date);
}

export function episodeFor(episodeProviderMapping, allShowEpisodes) {
  return allShowEpisodes.find(
    (e) => e.trackId.toString() === episodeProviderMapping.trackId
  );
}
