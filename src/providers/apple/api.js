const searchBaseUrl = "https://itunes.apple.com/search";
const lookupBaseUrl = "https://itunes.apple.com/lookup";

export function searchShows(searchText) {
  return fetch(makeShowSearchUrl(searchText)).then((res) => res.json());
}

function makeShowSearchUrl(searchText) {
  return `${searchBaseUrl}?media=podcast&term=${encodeURIComponent(
    searchText
  )}`;
}

export function searchEpisodes(searchText) {
  return fetch(makeEpisodeSearchUrl(searchText)).then((res) => res.json());
}

function makeEpisodeSearchUrl(searchText) {
  return `${searchBaseUrl}?media=podcast&entity=podcastEpisode&term=${encodeURIComponent(
    searchText
  )}`;
}

export function lookupShow(collectionId) {
  return fetch(makeShowLookupUrl(collectionId))
    .then((res) => res.json())
    .then(({ resultCount, results }) => {
      if (resultCount !== 1) {
        console.warn("result count", resultCount);
      }
      return results[0];
    });
}

function makeShowLookupUrl(collectionId) {
  return `${lookupBaseUrl}?media=podcast&id=${collectionId}`;
}

export function lookupEpisodes(collectionId) {
  return fetch(makeShowLookupEpisodesUrl(collectionId))
    .then((res) => res.json())
    .then(({ results }) =>
      // filter out the item that designates the collection itself as opposed to the episodes
      results.filter((r) => r.wrapperType === "podcastEpisode")
    );
}

function makeShowLookupEpisodesUrl(collectionId) {
  return `${lookupBaseUrl}?media=podcast&entity=podcastEpisode&id=${collectionId}`;
}
