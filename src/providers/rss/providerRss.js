import { fetchShowRssFeed } from "./showRssFeed";
import { subscribeToShow as subscribe } from "../../userData/showSubscriptions";
import { addEpisodeRss } from "../../userData/episdes";
export function showProviderMapping(rssFeedUrl) {
  return { rssFeedUrl };
}

export function providerFor(showProviderMapping) {
  return typeof showProviderMapping.rssFeedUrl !== "undefined";
}

export function fetchShow(showProviderMapping) {
  return fetchShowRssFeed(showProviderMapping.rssFeedUrl);
}

export function episodeFor(episodeProviderMapping, allShowEpisodes) {
  return allShowEpisodes.find(
    (e) =>
      e.guid === episodeProviderMapping.guid ||
      e.episodeUrl === episodeProviderMapping.showUrl
  );
}

export function subscriptionQuery(rssFeedUrlEncoded) {
  return `rssFeedUrl=${rssFeedUrlEncoded}`;
}

export function subscribeToShow(showProviderMapping) {
  return subscribe(showProviderMapping);
}

export function addEpisodes(showId, episodes) {
  const promises = episodes.map((episode) => {
    addEpisodeRss(showId, episode);
  });
  return Promise.all(promises);
}
