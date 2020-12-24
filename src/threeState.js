import { readable, writable } from "svelte/store";

export const initial = "initial";
export const loaded = "loaded";
export const error = "error";

export function threeStateFromPromise(promise) {
  return readable(makeInitial(), (set) => {
    promiseToThreeState(promise).then(set);
  });
}

export function writableThreeState(initializer = undefined) {
  const w = writable(makeInitial(), initializer);

  return {
    setLoaded(data) {
      w.set(makeLoaded(data));
    },
    setError(err) {
      w.set(makeError(err));
    },
    subscribe: w.subscribe,
  };
}

export function whenLoaded(reducer) {
  return (states) =>
    states.some(({ state }) => state === initial)
      ? makeInitial()
      : states.some(({ state }) => state === error)
      ? makeError(
          states
            .filter(({ state }) => state === error)
            .map(({ error }) => error)
        )
      : { state: loaded, data: reducer(states.map(({ data }) => data)) };
}

function promiseToThreeState(promise) {
  return promise
    .then((data) => makeLoaded(data))
    .catch((err) => ({ state: error, error: err }));
}

export function makeInitial() {
  return { state: initial };
}

export function makeLoaded(data) {
  return { state: loaded, data };
}

export function makeError(err) {
  return {
    state: error,
    error: Array.isArray(err)
      ? err.length === 1
        ? err[0]
        : { errors: err }
      : err,
  };
}
