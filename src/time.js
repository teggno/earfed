import { padStart } from "./strings";

export function secondsToTimeString(seconds) {
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.ceil(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${hours ? hours.toString() + ":" : ""}${
    hours || minutes ? padStart(minutes, 2, "0") + ":" : ""
  }${hours || minutes ? padStart(remainingSeconds, 2, "0") : seconds}`;
}
