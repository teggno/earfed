import { writable } from "svelte/store";

const audioEventsToListenTo = [
  "play",
  "playing",
  "pause",
  "timeupdate",
  "ended",
  "abort",
] as const;

/** @returns a svelte store that wraps a HTMLAudioElement */
export default function audioStoreFactory(audio: HTMLAudioElement) {
  const { subscribe, set } = writable(storeValueFromAudio(audio), (set) => {
    addEventListeners();
    set(storeValueFromAudio(audio));
    return removeEventListeners;
  });

  function addEventListeners() {
    audioEventsToListenTo.forEach((e) =>
      audio.addEventListener(e, handleChange)
    );
  }

  function removeEventListeners() {
    audioEventsToListenTo.forEach((e) =>
      audio.removeEventListener(e, handleChange)
    );
  }

  function handleChange() {
    set(storeValueFromAudio(audio));
  }

  return { subscribe };
}

function storeValueFromAudio(audio: HTMLAudioElement) {
  return {
    /** seconds */
    currentTime: audio.currentTime,
    /** seconds, NaN if not available, Infinity if streaming */
    duration: audio.duration,
    paused: audio.paused,
    ended: audio.ended,
    src: audio.src,
  };
}
