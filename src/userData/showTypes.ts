import type { Provider } from "../providers";
import type { RssItem } from "./episodeTypes";

export type AppleCollectionId = number;
export interface AppleShowProviderMapping {
  collectionId: AppleCollectionId;
}

export type RssFeedUrl = string;
export interface RssShowProviderMapping {
  rssFeedUrl: RssFeedUrl;
}

export interface AppleShowId {
  provider: Provider.Apple;
  providerShowId: AppleCollectionId;
}

export interface RssShowId {
  provider: Provider.Rss;
  providerShowId: RssFeedUrl;
}

export type ShowId = AppleShowId | RssShowId;

export enum ShowStatus {
  Subscribed = "s",
  NotSubscribed = "n",
}

export interface ShowValueBase {
  status: { value: ShowStatus; updated: Date };
}

export interface AppleShowValue extends AppleShowId, ShowValueBase {
  collection: { value: AppleCollection; updated: Date };
}

export interface RssShowValue extends RssShowId, ShowValueBase {
  channel: { value: RssChannel; updated: Date };
}

export type ShowValue = AppleShowValue | RssShowValue;
export type ShowKeyTuple =
  | [Provider.Apple, AppleCollectionId]
  | [Provider.Rss, RssFeedUrl];

export interface AppleCollection {
  collectionId: AppleCollectionId;
  collectionName: string;
  artworkUrl60: string | undefined;
  artworkUrl600: string | undefined;
  artistName: string | undefined;
  genres: string[] | undefined;
}

export interface RssChannel {
  title: string;
  itunesImage: { href: string | undefined } | undefined;
  itunesAuthor: string | undefined;
}

export interface RssChannelWithItems extends RssChannel {
  items: RssItem[];
}
