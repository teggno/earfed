import { showImageUrlThumb, showImageUrlMedium } from "../config";
import { Provider } from "../providers";
import type { RssChannel, RssFeedUrl, RssShowId } from "../userData/showTypes";
import ShowBase, {
  defaultShowStatus,
  ShowStatusContainer,
  defaultUpdated,
} from "./ShowBase";
import type { RssShowInput } from "../userData/shows";

export default class RssShow extends ShowBase {
  constructor(
    private readonly rssFeedUrl: string,
    channel: { value: RssChannel; updated?: Date },
    status: ShowStatusContainer = defaultShowStatus()
  ) {
    super(status);
    this.channel = { ...channel, updated: channel.updated ?? defaultUpdated() };
  }

  private readonly channel: { value: RssChannel; updated: Date };

  get showTitle() {
    return this.channel.value.title;
  }

  get showImageUrl() {
    return this.channel.value.itunesImage?.href
      ? showImageUrlThumb(this.channel.value.itunesImage?.href)
      : undefined;
  }

  get showImageUrlMedium() {
    return this.channel.value.itunesImage?.href
      ? showImageUrlMedium(this.channel.value.itunesImage?.href)
      : undefined;
  }

  get categories() {
    return [] as string[];
  }

  get artistName() {
    return this.channel.value.itunesAuthor;
  }

  get uniqueShowId() {
    return rssUniqueShowId(this.rssFeedUrl);
  }

  get subscribedShowUrl() {
    return (
      "/subscriptions/shows/rss?rssFeedUrl=" +
      encodeURIComponent(this.rssFeedUrl)
    );
  }

  sameShow(rssFeedUrl: string) {
    return rssFeedUrl === this.rssFeedUrl;
  }

  makeShowInput(): RssShowInput {
    return {
      channel: this.channel.value,
      provider: Provider.Rss,
      rssFeedUrl: this.rssFeedUrl,
    };
  }

  makeShowId(): RssShowId {
    return {
      provider: Provider.Rss,
      providerShowId: this.rssFeedUrl,
    };
  }
}

export function rssUniqueShowId(rssFeedUrl: RssFeedUrl) {
  return `${Provider.Rss}_${rssFeedUrl}`;
}
