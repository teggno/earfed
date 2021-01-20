import type { AppleTrack } from "../../userData/episodeTypes";
import { lookupCollection, lookupTracks } from "./api";
import { validateCollection, validateTrack } from "./appleValidation";

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
