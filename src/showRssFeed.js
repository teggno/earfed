import { corsProxyUrl } from "./config";
import parseXmlString from "./xml";

export async function fetchShowRssFeed(showRssFeedUrl) {
  const feedXmlString = await fetch(
    `${corsProxyUrl}/${showRssFeedUrl}`
  ).then((res) => res.text());
  const feedXmlDocument = parseXmlString(feedXmlString);
  return parseShowFeed(feedXmlDocument);
}

export function parseShowFeed(feedXmlDocument) {
  if (feedXmlDocument.documentElement.nodeName === "parsererror") {
    throw new Error("error parsing feed XML");
  }

  const channelElement = feedXmlDocument.documentElement.getElementsByTagName(
    "channel"
  )[0];

  const show = { episodes: [] };
  for (var i = 0; i < channelElement.childNodes.length; i++) {
    const node = channelElement.childNodes[i];
    if (node.nodeName === "title") {
      show.showName = node.textContent;
    } else if (node.nodeName === "language") {
      show.language = node.textContent;
    } else if (node.nodeName === "itunes:image") {
      // TODO: as seen these images can get quite big. So maybe pass them
      // through some image resize (and then caching) service.
      show.showIconUrl = node.getAttribute("href");
    } else if (node.nodeName === "item") {
      const episode = parseItem(node);
      if (episode) {
        show.episodes.push(parseItem(node));
      }
    }
  }

  return show;
}

function parseItem(itemElement) {
  const episode = {};
  for (var i = 0; i < itemElement.childNodes.length; i++) {
    const node = itemElement.childNodes[i];
    if (node.nodeName === "itunes:title" || node.nodeName === "title") {
      episode.episodeTitle = node.textContent;
    } else if (node.nodeName === "description") {
      episode.episodeDescription = node.nodeValue;
    } else if (node.nodeName === "pubDate") {
      episode.pubDate = new Date(node.textContent);
    } else if (node.nodeName === "itunes:duration") {
      episode.durationSeconds = parseInt(node.textContent);
    } else if (node.nodeName === "enclosure") {
      episode.episodeUrl = node.getAttribute("url");
    }
  }
  return episode;
}
