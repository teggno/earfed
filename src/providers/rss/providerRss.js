import { parseShowFeed } from "./rssFeedParser";
import { corsProxyUrl } from "../../config";
import parseXmlString from "../../xml";

export const rss = "rss";

export function providerFor(showProviderMapping) {
  return typeof showProviderMapping.rssFeedUrl !== "undefined";
}

export async function fetchShow(showProviderMapping) {
  const feedXmlString = await fetch(
    `${corsProxyUrl ? corsProxyUrl + "/" : ""}${showProviderMapping.rssFeedUrl}`
  ).then((res) => res.text());
  const feedXmlDocument = parseXmlString(feedXmlString);
  return {
    ...parseShowFeed(feedXmlDocument),
    subscribedShowUrl: subscribedShowUrl(showProviderMapping.rssFeedUrl),
  };
}

export function episodeFor({ guid, showUrl }, allShowEpisodes) {
  return allShowEpisodes.find(
    (e) => e.guid === guid || e.episodeUrl === showUrl
  );
}

export function showRecord({ rssFeedUrl }) {
  return {
    provider: rss,
    providerShowId: rssFeedUrl,
    providerMapping: makeShowProviderMapping(rssFeedUrl),
  };
}

export function episodeRecord({ guid }) {
  return { providerEpisodeId: guid, providerMapping: { guid } };
}

function makeShowProviderMapping(rssFeedUrl) {
  return { rssFeedUrl };
}

function subscribedShowUrl(rssFeedUrl) {
  return (
    "/subscriptions/shows/" +
    rss +
    "?rssFeedUrl=" +
    encodeURIComponent(rssFeedUrl)
  );
}
