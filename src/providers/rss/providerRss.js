import { parseShowFeed } from "./rssFeedParser";
import {
  subscribeToShow as subscribeIndb,
  addShowIfNotAdded as addShowIfNotAddedToDb,
} from "../../userData/shows";
import { corsProxyUrl } from "../../config";
import parseXmlString from "../../xml";
import { addEpisodes as addEpisodesToDb } from "../../userData/episodes";

export const rss = "rss";

export function providerFor(showProviderMapping) {
  return typeof showProviderMapping.rssFeedUrl !== "undefined";
}

export async function fetchShow(showProviderMapping) {
  const feedXmlString = await fetch(
    `${corsProxyUrl ? corsProxyUrl + "/" : ""}${showProviderMapping.rssFeedUrl}`
  ).then((res) => res.text());
  const feedXmlDocument = parseXmlString(feedXmlString);
  return parseShowFeed(feedXmlDocument);
}

export function episodeFor({ guid, showUrl }, allShowEpisodes) {
  return allShowEpisodes.find(
    (e) => e.guid === guid || e.episodeUrl === showUrl
  );
}

export function subscribeToShow(rssFeedUrl, date) {
  return subscribeIndb(
    "rss",
    rssFeedUrl,
    makeShowProviderMapping(rssFeedUrl),
    date
  );
}

export async function queueEpisode({ rssFeedUrl, guid }, date) {
  const { showId } = await addShowIfNotAdded(rssFeedUrl, date);
  await addEpisodes(showId, [{ guid }], date);
}

export function addShowIfNotAdded(rssFeedUrl, date) {
  return addShowIfNotAddedToDb(
    rss,
    rssFeedUrl,
    makeShowProviderMapping(rssFeedUrl),
    date
  );
}

export function addEpisodes(showId, episodes, date) {
  const payload = episodes.map((episode) => ({
    providerEpisodeId: episode.guid,
    showId,
    providerMapping: { guid: episode.guid },
  }));

  return addEpisodesToDb(payload, date);
}

function makeShowProviderMapping(rssFeedUrl) {
  return { rssFeedUrl };
}
