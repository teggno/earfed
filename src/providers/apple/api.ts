const searchBaseUrl = "https://itunes.apple.com/search";
const lookupBaseUrl = "https://itunes.apple.com/lookup";

export function searchShows(
  searchText: string
): Promise<{ results: FetchedCollection[] }> {
  return fetch(makeShowSearchUrl(searchText)).then((res) => res.json());
}

function makeShowSearchUrl(searchText: string) {
  return `${searchBaseUrl}?media=podcast&term=${encodeURIComponent(
    searchText
  )}`;
}

export function searchEpisodes(
  searchText: string
): Promise<{ results: FetchedTrack[] }> {
  return fetch(makeEpisodeSearchUrl(searchText)).then((res) => res.json());
}

function makeEpisodeSearchUrl(searchText: string) {
  return `${searchBaseUrl}?media=podcast&entity=podcastEpisode&term=${encodeURIComponent(
    searchText
  )}`;
}

export function lookupCollection(
  collectionId: number
): Promise<FetchedCollection | undefined> {
  return fetch(makeShowLookupUrl(collectionId))
    .then((res) => res.json())
    .then(({ resultCount, results }) => {
      if (resultCount !== 1) {
        console.warn("result count", resultCount);
      }
      return results[0];
    });
}

function makeShowLookupUrl(collectionId: number) {
  return `${lookupBaseUrl}?media=podcast&id=${collectionId}`;
}

export function lookupTracks(collectionId: number): Promise<FetchedTrack[]> {
  return fetch(makeShowLookupEpisodesUrl(collectionId))
    .then((res) => res.json())
    .then(({ results }) =>
      // filter out the item that designates the collection itself as opposed to the episodes
      results.filter((r: any) => r.wrapperType === "podcastEpisode")
    );
}

function makeShowLookupEpisodesUrl(collectionId: number) {
  return `${lookupBaseUrl}?media=podcast&entity=podcastEpisode&id=${collectionId}`;
}

export interface FetchedCollection {
  genres: string[] | undefined;
  collectionId: number;
  collectionName: string | undefined;
  artworkUrl60: string | undefined;
  artworkUrl600: string | undefined;
  artistName: string | undefined;
}

export interface FetchedTrack {
  collectionId: number;
  collectionName: string | undefined;
  trackTimeMillis: number | undefined;
  trackId: number;
  trackName: string | undefined;
  releaseDate: string | undefined;
  description: string;
  episodeUrl: string | undefined;
  artworkUrl60: string | undefined;
}
