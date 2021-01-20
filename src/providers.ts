import type { AppleTrackId, RssEpisodeGuid } from "./userData/episodeTypes";

export enum Provider {
  Apple = "apple",
  Rss = "rss",
}

export function appleUniqueEpisodeId(trackId: AppleTrackId) {
  return `${Provider.Apple}_${trackId}`;
}

export function rssUniqueEpisodeId(guid: RssEpisodeGuid) {
  return `${Provider.Rss}_${guid}`;
}
