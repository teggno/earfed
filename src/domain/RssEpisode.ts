import { rssUniqueEpisodeId, Provider } from "../providers";
import type { RssItem } from "../userData/episodeTypes";
import {
  EpisodeBase,
  PositionSecondsContainer,
  QueueStatusContainer,
} from "./EpisodeBase";
import type RssShow from "./RssShow";
import { timeStringToSeconds } from "../time";

export default class RssEpisode extends EpisodeBase {
  constructor(
    item: RssItem | { value: RssItem; updated: Date },
    private readonly show: RssShow,
    positionSecondsContainer?: PositionSecondsContainer,
    queueStatusContainer?: QueueStatusContainer
  ) {
    super(positionSecondsContainer, queueStatusContainer);

    this.itemContainer =
      "updated" in item ? item : { updated: new Date(), value: item };
  }

  private readonly itemContainer: { updated: Date; value: RssItem };

  get episodeTitle() {
    return this.item.title;
  }

  get pubDate() {
    return this.item.pubDate ? new Date(this.item.pubDate) : undefined;
  }

  get uniqueEpisodeId() {
    return rssUniqueEpisodeId(this.item.guid);
  }

  get item() {
    return this.itemContainer.value;
  }

  get episodeUrl() {
    return this.item.enclosure.url;
  }

  get episodeDescription() {
    return this.item.description;
  }

  get durationSeconds() {
    return this.item.itunesDuration
      ? timeStringToSeconds(this.item.itunesDuration)
      : undefined;
  }

  get showTitle() {
    return this.show.showTitle;
  }

  get showImageUrl() {
    return this.show.showImageUrl;
  }

  get showImageUrlMedium() {
    return this.show.showImageUrlMedium;
  }

  get uniqueShowId() {
    return this.show.uniqueShowId;
  }

  get episodeId() {
    return {
      provider: Provider.Rss as Provider.Rss,
      guid: this.item.guid,
    };
  }
}
