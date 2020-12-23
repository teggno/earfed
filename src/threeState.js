import { readable, writable } from "svelte/store";

export const initial = "initial";
export const loaded = "loaded";
export const error = "error";

export function threeStateFromPromise(promise) {
  return readable({ state: initial }, (set) => {
    promiseToThreeState(promise).then(set);
  });
}

export function writableThreeState() {
  const w = writable({ state: initial });

  return {
    loaded(data) {
      w.set({ state: loaded, data });
    },
    error(err) {
      w.set({ state: error, error: err });
    },
    subscribe: w.subscribe,
  };
}

export function whenLoaded(reducer) {
  return (states) =>
    states.some(({ state }) => state === initial)
      ? { state: initial }
      : states.some(({ state }) => state === error)
      ? { state: error }
      : { state: loaded, data: reducer(states.map(({ data }) => data)) };
}

function promiseToThreeState(promise) {
  return promise
    .then((data) => ({ state: loaded, data }))
    .catch((err) => ({ state: error, error: err }));
}
