import {
  EpisodeDescription,
  EpisodeDescriptionType,
} from "../../userData/episodeTypes";

export function parseShowFeed(feedXmlDocument: Document) {
  if (feedXmlDocument.documentElement.nodeName === "parsererror") {
    throw new Error("error parsing feed XML");
  }

  const channelElement = feedXmlDocument.documentElement.getElementsByTagName(
    "channel"
  )[0];

  const channel = { items: [] as ParsedItem[] } as ParsedChannel;
  for (var i = 0; i < channelElement.childNodes.length; i++) {
    const node = channelElement.childNodes[i];
    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    if (node.nodeName === "title") {
      channel.title = node.textContent || undefined;
    } else if (node.nodeName === "language") {
      channel.language = node.textContent || undefined;
    } else if (node.nodeName === "itunes:image") {
      channel.itunesImage = {
        href: (node as Element).getAttribute("href") || undefined,
      };
    } else if (node.nodeName === "itunes:author") {
      channel.itunesAuthor = node.textContent || undefined;
    } else if (node.nodeName === "item" && node.nodeType == Node.ELEMENT_NODE) {
      const episode = parseEpisode(node as Element);
      channel.items.push(episode);
    }
  }

  return channel;
}

function parseEpisode(itemElement: Element) {
  const episode = {} as ParsedItem;
  for (var i = 0; i < itemElement.childNodes.length; i++) {
    const node = itemElement.childNodes[i];
    if (node.nodeName === "itunes:title") {
      episode.itunesTitle = node.textContent || undefined;
    } else if (node.nodeName === "title") {
      episode.title = node.textContent || undefined;
    } else if (node.nodeName === "pubDate") {
      episode.pubDate = node.textContent || undefined;
    } else if (node.nodeName === "itunes:duration") {
      episode.itunesDuration = node.textContent || undefined;
    } else if (
      node.nodeName === "enclosure" &&
      node.nodeType === Node.ELEMENT_NODE
    ) {
      episode.enclosure = {
        url: (node as Element).getAttribute("url") || undefined,
      };
    } else if (node.nodeName === "guid") {
      episode.guid = node.textContent || undefined;
    } else if (node.nodeName === "description") {
      const nonEmptyChild = firstNonEmptyChild(node);
      if (
        nonEmptyChild &&
        nonEmptyChild.nodeType === Node.TEXT_NODE &&
        node.textContent !== null
      ) {
        episode.description = {
          type: EpisodeDescriptionType.Text,
          value: node.textContent,
        };
      } else if (
        nonEmptyChild &&
        nonEmptyChild.nodeType === Node.CDATA_SECTION_NODE &&
        node.textContent !== null
      ) {
        episode.description = {
          type: EpisodeDescriptionType.Html,
          value: node.textContent,
        };
      } else {
        episode.description = { type: EpisodeDescriptionType.Text, value: "" };
      }
    }
  }
  return episode;
}

export interface ParsedChannel {
  title: string | undefined;
  language: string | undefined;
  itunesImage: { href: string | undefined } | undefined;
  itunesAuthor: string | undefined;
  items: ParsedItem[];
}

export interface ParsedItem {
  itunesTitle: string | undefined;
  title: string | undefined;
  pubDate: string | undefined;
  itunesDuration: string | undefined;
  enclosure: { url: string | undefined } | undefined;
  guid: string | undefined;
  description: EpisodeDescription | undefined;
}

const whitespace = /\s+/;

function firstNonEmptyChild(parentElement: Node) {
  let child = parentElement.firstChild;
  while (
    child &&
    child.nodeType === Node.TEXT_NODE &&
    (child.textContent?.match(whitespace) ?? false)
  ) {
    child = child.nextSibling;
  }
  return child;
}
