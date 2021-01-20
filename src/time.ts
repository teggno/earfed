import { padStart } from "./strings";

export function secondsToTimeString(seconds: number) {
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.floor(seconds / 60) % 60;
  const remainingSeconds = seconds % 60;
  return `${hours ? hours.toString() + ":" : ""}${
    padStart(minutes.toString(), 2, "0") + ":"
  }${padStart(Math.round(remainingSeconds).toString(), 2, "0")}`;
}

/** Takes a string in the format hh:mm:ss or mm:ss or sss or s and returns its
 * total seconds */
export function timeStringToSeconds(timeString: string) {
  const parts = timeString.split(":");
  return parts
    .reverse()
    .reduce(
      (seconds, part, i) => seconds + parseInt(part) * Math.pow(60, i),
      0
    );
}
