import { readable } from "svelte/store";

export const initial = "initial";
export const loaded = "loaded";
export const error = "error";

export function threeStateFromPromise(promise) {
  return readable({ state: initial }, (set) => {
    promise
      .then((data) => {
        set({ state: loaded, data });
      })
      .catch((error) => {
        set({ state: error, error });
      });
  });
}

export function whenLoaded(reducer) {
  return (states) =>
    states.some(({ state }) => state === initial)
      ? { state: initial }
      : states.some(({ state }) => state === error)
      ? { state: error }
      : { state: loaded, data: reducer(states.map(({ data }) => data)) };
}
