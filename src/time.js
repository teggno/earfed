import { padStart } from "./strings";

export function secondsToTimeString(seconds) {
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.floor(seconds / 60) % 60;
  const remainingSeconds = seconds % 60;
  return `${hours ? hours.toString() + ":" : ""}${
    padStart(minutes, 2, "0") + ":"
  }${padStart(remainingSeconds, 2, "0")}`;
}
