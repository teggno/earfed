import { ParsedChannel, parseShowFeed, ParsedItem } from "./rssFeedParser";
import { corsProxyUrl } from "../../config";
import parseXmlString from "../../xml";
import { RssItem, EpisodeDescriptionType } from "../../userData/episodeTypes";
import type { RssChannelWithItems } from "../../userData/showTypes";

export const rss = "rss";

export function providerFor(showProviderMapping: RssShowProviderMapping) {
  return typeof showProviderMapping.rssFeedUrl !== "undefined";
}

export async function fetchChannel(rssFeedUrl: string) {
  const feedXmlString = await fetch(
    `${corsProxyUrl ? corsProxyUrl + "/" : ""}${rssFeedUrl}`
  ).then((res) => res.text());
  const feedXmlDocument = parseXmlString(feedXmlString);
  const parsedChannel = parseShowFeed(feedXmlDocument);
  const wrapper = validateChannel(parsedChannel);
  if ("errors" in wrapper) {
    throw new Error(
      `validating channel from rss xml failed. \n\t${wrapper.errors.join(
        "\t\n"
      )}`
    );
  }
  return wrapper.rssChannel;
}

export function showRecord({ rssFeedUrl }: { rssFeedUrl: string }) {
  return {
    provider: rss,
    providerShowId: rssFeedUrl,
    providerMapping: makeShowProviderMapping(rssFeedUrl),
  };
}

export function episodeRecord({ guid }: { guid: string }) {
  return { providerEpisodeId: guid, providerMapping: { guid } };
}

function makeShowProviderMapping(rssFeedUrl: string) {
  return { rssFeedUrl };
}

function validateChannel(
  parsedChannel: ParsedChannel
): { errors: string[] } | { rssChannel: RssChannelWithItems } {
  const errors: string[] = [];
  if (!parsedChannel.title) {
    errors.push("missing title");
  }
  const itemValidationResults = parsedChannel.items.map(validateItem);
  const validItems = itemValidationResults
    .map((w) => ("rssItem" in w ? w.rssItem : undefined))
    .filter((rssItem) => rssItem) as RssItem[];

  return errors.length
    ? { errors }
    : {
        rssChannel: {
          title: parsedChannel.title as string,
          itunesImage: parsedChannel.itunesImage,
          itunesAuthor: parsedChannel.itunesAuthor,
          items: validItems,
        },
      };
}

function validateItem(
  parsedItem: ParsedItem
): { errors: string[] } | { rssItem: RssItem } {
  const errors: string[] = [];
  if (!parsedItem.itunesTitle && !parsedItem.title) {
    errors.push("missing itunesTitle and title");
  }
  if (!parsedItem.enclosure?.url) {
    errors.push("missing enclosure.url");
  }
  if (!parsedItem.guid) {
    errors.push("missing guid");
  }
  return errors.length
    ? { errors }
    : {
        rssItem: {
          title: (parsedItem.itunesTitle || parsedItem.title) as string,
          enclosure: (parsedItem.enclosure as any) as { url: string },
          pubDate: parsedItem.pubDate,
          guid: parsedItem.guid as string,
          itunesDuration: parsedItem.itunesDuration,
          description: parsedItem.description ?? emptyEpisodeDescription(),
        },
      };
}

interface RssShowProviderMapping {
  rssFeedUrl: string;
}

function emptyEpisodeDescription() {
  return { type: EpisodeDescriptionType.Text, value: "" };
}
