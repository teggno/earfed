import { ShowStatus } from "../userData/showTypes";

export default class ShowBase {
  constructor(
    private readonly showStatusContainer: ShowStatusContainer = defaultShowStatus()
  ) {}

  get status() {
    return this.showStatusContainer.value;
  }
}

export interface ShowStatusContainer {
  value: ShowStatus;
  updated: Date;
}

export function defaultShowStatus() {
  return {
    value: ShowStatus.NotSubscribed,
    updated: new Date(),
  };
}

export function defaultUpdated() {
  return new Date();
}
