import { Provider } from "../../providers";
import {
  lookupTracks,
  lookupCollection,
  FetchedCollection,
  FetchedTrack,
} from "./api";
import type { AppleCollection } from "../../userData/showTypes";
import type {
  AppleTrack,
  EpisodeDescriptionType,
} from "../../userData/episodeTypes";
import { validateCollection, validateTrack } from "./appleValidation";

// export function providerFor(showProviderMapping: AppleShowProviderMapping) {
//   return typeof showProviderMapping.collectionId !== "undefined";
// }

export async function fetchCollection(collectionId: number) {
  const fetchedCollection = await lookupCollection(collectionId);
  if (!fetchedCollection) {
    throw new Error("collection not found");
  }
  const collectionValidationResult = validateCollection(fetchedCollection);
  if ("errors" in collectionValidationResult) {
    throw new Error(collectionValidationResult.errors.join("\n"));
  }
  return collectionValidationResult.appleCollection;
}

export async function fetchTracks(collectionId: number) {
  const tracks = await lookupTracks(collectionId);
  const validationResults = tracks.map(validateTrack);
  return validationResults
    .map((r) => ("appleTrack" in r ? r.appleTrack : undefined))
    .filter((r) => r) as AppleTrack[];
}

// export function episodeFor({ trackId }, allShowEpisodes) {
//   return allShowEpisodes.find((e) => e.trackId === trackId);
// }

// function appleShowToShow(appleShow) {
//   return {
//     showTitle: appleShow.collectionName,
//     showImageUrl: appleShow.artworkUrl60,
//     categories: appleShow.genres,
//     artistName: appleShow.artistName,
//   };
// }

// function appleEpisodeToEpisode(appleEpisode) {
//   return {
//     ...appleEpisode,
//     episodeTitle: appleEpisode.trackName,
//     pubDate: new Date(appleEpisode.releaseDate),
//     episodeDescription: {
//       type: "html",
//       value: appleEpisode.description
//         .replace(/\n/g, "<br/>")
//         .replace(
//           /\t/g,
//           '<span style="display:inline-block;width: 10px;"></span>'
//         ),
//     },
//     durationSeconds: appleEpisode.trackTimeMillis / 1000,
//   };
// }

export function showRecord({ collectionId }) {
  return {
    provider: Provider.Apple,
    providerShowId: collectionId,
    providerMapping: makeShowProviderMapping(collectionId),
  };
}

export function episodeRecord({ trackId }) {
  return { providerEpisodeId: trackId, providerMapping: { trackId } };
}

// export function episodeRecord2({
//   collectionId,
//   trackId,
//   episodeData,
// }: {
//   trackId: number;
//   collectionId: number;
//   episodeData: EpisodeData;
// }) {
//   return {
//     episodeId: { provider: , providerEpisodeId: trackId },
//     providerMapping: { trackId },
//     showId: { provider: apple, providerShowId: collectionId },
//     episodeData,
//   };
// }

// interface EpisodeData {
//   episodeTitle: string;
//   pubDate?: Date;
//   durationSeconds: string;
//   episodeDescription?: string;
//   episodeUrl: string;
// }

export function episodeKey({ trackId }) {
  return { providerEpisodeId: trackId, providerMapping: { trackId } };
}

function makeShowProviderMapping(collectionId) {
  return { collectionId };
}
