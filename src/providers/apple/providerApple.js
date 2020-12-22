import { lookupEpisodes, lookupShow } from "./api";

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
  return allShowEpisodes.find((e) => e.trackId === trackId);
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

export function showRecord({ collectionId }) {
  return {
    provider: apple,
    providerShowId: collectionId,
    providerMapping: makeShowProviderMapping(collectionId),
  };
}

export function episodeRecord({ trackId }) {
  return { providerEpisodeId: trackId, providerMapping: { trackId } };
}

function makeShowProviderMapping(collectionId) {
  return { collectionId };
}
