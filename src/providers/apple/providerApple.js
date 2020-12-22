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

export function episodeFor({ trackId }, allShowEpisodes) {
  return allShowEpisodes.find((e) => e.trackId.toString() === trackId);
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
    makeShowProviderMapping(collectionId),
    date
  );
}

export async function queueEpisode({ collectionId, trackId }, date) {
  const { showId } = await addShowIfNotAdded(collectionId, date);
  await addEpisodes(showId, [{ trackId }], date);
}

export function addShowIfNotAdded(collectionId, date) {
  return addShowIfNotAddedToDb(
    apple,
    collectionId,
    makeShowProviderMapping(collectionId),
    date
  );
}

export function addEpisodes(showId, episodes, date) {
  const payload = episodes.map((episode) => ({
    providerEpisodeId: episode.trackId,
    showId,
    providerMapping: { trackId: episode.trackId.toString() },
  }));

  return addEpisodesTodb(payload, date);
}

function makeShowProviderMapping(collectionId) {
  return { collectionId };
}
