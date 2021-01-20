import type { AppleCollectionId, RssFeedUrl } from "./showTypes";
import type { Provider } from "../providers";

export type AppleTrackId = number;
export type RssEpisodeGuid = string;

export interface AppleEpisodeId {
  provider: Provider.Apple;
  trackId: AppleTrackId;
}

export interface RssEpisodeId {
  provider: Provider.Rss;
  guid: RssEpisodeGuid;
}

export type EpisodeId = AppleEpisodeId | RssEpisodeId;

export interface AppleEpisodeKey {
  provider: Provider.Apple;
  providerEpisodeId: AppleTrackId;
}

export interface RssEpisodeKey {
  provider: Provider.Rss;
  providerEpisodeId: RssEpisodeGuid;
}

export type EpisodeKey = AppleEpisodeKey | RssEpisodeKey;

export enum EpisodeQueueStatus {
  Queued = "q",
  Ended = "e",
  Deleted = "d",
}

export interface EpisodeValueBase {
  positionSeconds?: { value: number; updated: Date };
  status: { value: EpisodeQueueStatus; updated: Date };
}

export interface AppleEpisodeValue extends AppleEpisodeKey, EpisodeValueBase {
  collectionId: AppleCollectionId;
  track: { value: AppleTrack; updated: Date };
}

export interface RssEpisodeValue extends RssEpisodeKey, EpisodeValueBase {
  rssFeedUrl: RssFeedUrl;
  item: { value: RssItem; updated: Date };
}

export type EpisodeValue = AppleEpisodeValue | RssEpisodeValue;
export type EpisodeKeyTuple =
  | [Provider.Apple, AppleTrackId]
  | [Provider.Rss, RssEpisodeGuid];

export interface AppleTrack {
  collectionId: number;
  collectionName: string | undefined;
  episodeUrl: string;
  description: EpisodeDescription;
  trackTimeMillis: number | undefined;
  releaseDate: string | undefined;
  trackId: number;
  trackName: string;
  artworkUrl60: string | undefined;
}

export interface RssItem {
  enclosure: { url: string };
  description: EpisodeDescription;
  itunesDuration: string | undefined;
  pubDate?: string;
  title: string;
  guid: string;
}

export enum EpisodeDescriptionType {
  Text = "text",
  Html = "html",
}

export interface EpisodeDescription {
  type: EpisodeDescriptionType;
  value: string;
}
