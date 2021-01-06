import { writable } from "svelte/store";
import { oncer } from "./oncer";
import { initial, loaded } from "./threeState";
import { queryListedEpisodes } from "./userData/episodes";

const once = oncer();

export const userDataEpisodesStore = writable(
  { state: initial, data: [] },
  (set) => {
    once(() =>
      queryListedEpisodes().then((data) => {
        set({ state: loaded, data });
      })
    );
    return () => {};
  }
);

export function refreshUserDataEpisodes() {
  return queryListedEpisodes().then((data) =>
    userDataEpisodesStore.set({ state: loaded, data })
  );
}
