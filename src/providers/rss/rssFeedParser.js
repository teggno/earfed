import { timeStringToSeconds } from "../../time";

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
      show.showTitle = node.textContent;
    } else if (node.nodeName === "language") {
      show.language = node.textContent;
    } else if (node.nodeName === "itunes:image") {
      // TODO: as seen these images can get quite big. So maybe pass them
      // through some image resize (and then caching) service.
      show.showImageUrl = node.getAttribute("href");
    } else if (node.nodeName === "itunes:author") {
      show.artistName = node.textContent;
    } else if (node.nodeName === "item") {
      const episode = parseEpisode(node);
      if (episode) {
        show.episodes.push(parseEpisode(node));
      }
    }
  }

  return show;
}

/**
 *
 * @param {Element} itemElement
 */
function parseEpisode(itemElement) {
  const episode = {};
  for (var i = 0; i < itemElement.childNodes.length; i++) {
    const node = itemElement.childNodes[i];
    if (node.nodeName === "itunes:title" || node.nodeName === "title") {
      episode.episodeTitle = node.textContent;
    } else if (node.nodeName === "description") {
      const nonEmptyChild = firstNonEmptyChild(node);
      if (nonEmptyChild && nonEmptyChild.nodeType === Node.TEXT_NODE) {
        episode.episodeDescription = { type: "text", value: node.textContent };
      } else if (
        nonEmptyChild &&
        nonEmptyChild.nodeType === Node.CDATA_SECTION_NODE
      ) {
        episode.episodeDescription = {
          type: "html",
          value: node.textContent,
        };
      } else {
        episode.episodeDescription = { type: "text", value: "" };
      }
    } else if (node.nodeName === "pubDate") {
      episode.pubDate = new Date(node.textContent);
    } else if (node.nodeName === "itunes:duration") {
      episode.durationSeconds = timeStringToSeconds(node.textContent);
    } else if (node.nodeName === "enclosure") {
      episode.episodeUrl = node.getAttribute("url");
    } else if (node.nodeName === "guid") {
      episode.guid = node.textContent;
    }
  }
  return episode;
}

const whitespace = /\s+/;
/**
 *
 * @param {Element} parentElement
 */
function firstNonEmptyChild(parentElement) {
  let child = parentElement.firstChild;
  while (
    child &&
    child.nodeType === Node.TEXT_NODE &&
    child.textContent.match(whitespace)
  ) {
    child = child.nextSibling;
  }
  return child;
}
