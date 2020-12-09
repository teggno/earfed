import { lookupEpisodes, lookupShow } from "./api";
import { subscribeToShow as subscribeInDb } from "../../userData/showSubscriptions";
import { addEpisodes as addEpisodesTodb } from "../../userData/episodes";

export function showProviderMapping(collectionId) {
  return { collectionId };
}

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
    episodeDescription: { type: "text" },
  };
}

export function subscribeToShow(collectionId) {
  return subscribeInDb("apple", collectionId, {
    collectionId,
  });
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
