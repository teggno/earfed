import type { FetchedCollection, FetchedTrack } from "./api";
import type { AppleCollection } from "../../userData/showTypes";
import {
  AppleTrack,
  EpisodeDescriptionType,
} from "../../userData/episodeTypes";

export function validateCollection(
  fetchedCollection: FetchedCollection
): ErrorValidationResult | ValidCollectionResult {
  const errors: string[] = [];
  if (!fetchedCollection.collectionName) {
    errors.push("missing collectionName");
  }
  return errors.length
    ? { errors }
    : {
        appleCollection: {
          collectionId: fetchedCollection.collectionId,
          collectionName: fetchedCollection.collectionName as string,
          artworkUrl60: fetchedCollection.artworkUrl60,
          artworkUrl600: fetchedCollection.artworkUrl600,
          artistName: fetchedCollection.artistName,
          genres: fetchedCollection.genres,
        },
      };
}

export function validateTrack(
  fetchedTrack: FetchedTrack
): ErrorValidationResult | ValidTrackResult {
  const errors: string[] = [];
  if (!fetchedTrack.trackName) {
    errors.push("missing trackName");
  }
  if (!fetchedTrack.episodeUrl) {
    errors.push("missing episodeUrl");
  }

  return errors.length
    ? { errors }
    : {
        appleTrack: {
          trackId: fetchedTrack.trackId,
          collectionId: fetchedTrack.collectionId,
          collectionName: fetchedTrack.collectionName,
          artworkUrl60: fetchedTrack.artworkUrl60,
          trackName: fetchedTrack.trackName as string,
          episodeUrl: fetchedTrack.episodeUrl as string,
          releaseDate: fetchedTrack.releaseDate,
          description: fetchedTrack.description
            ? {
                type: EpisodeDescriptionType.Html,
                value: fetchedTrack.description
                  .replace(/\n/g, "<br/>")
                  .replace(
                    /\t/g,
                    '<span style="display:inline-block;width: 10px;"></span>'
                  ),
              }
            : { type: EpisodeDescriptionType.Text, value: "" },
          trackTimeMillis: fetchedTrack.trackTimeMillis,
        },
      };
}

export function isValidCollection(
  validationResult: ErrorValidationResult | ValidCollectionResult
): validationResult is ValidCollectionResult {
  return !("errors" in validationResult);
}

export function isValidTrack(
  validationResult: ErrorValidationResult | ValidTrackResult
): validationResult is ValidTrackResult {
  return !("errors" in validationResult);
}

export interface ValidCollectionResult {
  appleCollection: AppleCollection;
}
export interface ValidTrackResult {
  appleTrack: AppleTrack;
}
export interface ErrorValidationResult {
  errors: string[];
}
