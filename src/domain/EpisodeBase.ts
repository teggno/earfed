import type { EpisodeQueueStatus } from "../userData/episodeTypes";

export class EpisodeBase {
  constructor(
    private readonly positionSecondsContainer?: PositionSecondsContainer,
    private readonly queueStatusContainer?: QueueStatusContainer
  ) {}

  get positionSeconds() {
    return this.positionSecondsContainer?.value ?? 0;
  }

  get positionSecondsUpdated() {
    return this.positionSecondsContainer?.updated;
  }

  get queueStatus() {
    return this.queueStatusContainer?.value;
  }
}

export interface QueueStatusContainer {
  value: EpisodeQueueStatus;
  updated: Date;
}

export interface PositionSecondsContainer {
  value: number;
  updated: Date;
}
