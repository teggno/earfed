import { padStart } from "./strings";

export function secondsToTimeString(seconds) {
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.floor(seconds / 60) % 60;
  const remainingSeconds = seconds % 60;
  return `${hours ? hours.toString() + ":" : ""}${
    padStart(minutes, 2, "0") + ":"
  }${padStart(remainingSeconds, 2, "0")}`;
}

/** Takes a string in the format hh:mm:ss or mm:ss or sss or s and returns its
 * total seconds */
export function timeStringToSeconds(timeString) {
  const parts = timeString.split(":");
  return parts
    .reverse()
    .reduce(
      (seconds, part, i) => seconds + parseInt(part) * Math.pow(60, i),
      0
    );
}
