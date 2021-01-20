import { appleUniqueEpisodeId, Provider } from "../providers";
import type { AppleTrack } from "../userData/episodeTypes";
import type AppleShow from "./AppleShow";
import {
  EpisodeBase,
  PositionSecondsContainer,
  QueueStatusContainer,
} from "./EpisodeBase";

export default class AppleEpisode extends EpisodeBase {
  constructor(
    track: AppleTrack | { value: AppleTrack; updated: Date },
    private readonly show: AppleShow,
    positionSecondsContainer?: PositionSecondsContainer,
    queueStatusContainer?: QueueStatusContainer
  ) {
    super(positionSecondsContainer, queueStatusContainer);

    this.trackContainer =
      "updated" in track ? track : { updated: new Date(), value: track };
  }

  private readonly trackContainer: { updated: Date; value: AppleTrack };

  get episodeTitle() {
    return this.track.trackName;
  }

  get pubDate() {
    return this.track.releaseDate
      ? new Date(this.track.releaseDate)
      : undefined;
  }

  get uniqueEpisodeId() {
    return appleUniqueEpisodeId(this.track.trackId);
  }

  get track() {
    return this.trackContainer.value;
  }

  get episodeUrl() {
    return this.track.episodeUrl;
  }

  get episodeDescription() {
    return this.track.description;
  }

  get durationSeconds() {
    return this.track.trackTimeMillis
      ? this.track.trackTimeMillis / 1000
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
      provider: Provider.Apple as Provider.Apple,
      trackId: this.track.trackId,
    };
  }
}
