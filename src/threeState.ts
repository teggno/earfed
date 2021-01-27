import { readable, writable, Readable } from "svelte/store";
import { oncer } from "./oncer";

export const initial = "initial";
export const loading = "loading";
export const loaded = "loaded";
export const error = "error";

export function threeStateFromPromise<T>(promise: Promise<T>) {
  return readable(makeInitial<T>(), (set) => {
    set(makeLoading<T>());
    promise
      .then((data) => set(makeLoaded(data)))
      .catch((err) => set(makeError(err)));
  });
}

export function writableThreeState<T>(initializer?: {
  (set: { (value: ThreeState<T>): void }): void;
}) {
  const w = writable(makeInitial<T>(), initializer);

  return {
    setLoaded(data: T) {
      w.set(makeLoaded(data));
    },
    setLoading() {
      w.set(makeLoading());
    },
    setError(err: any) {
      w.set(makeError(err));
    },
    subscribe: w.subscribe,
  };
}

type Initial = { state: "initial" };
type Loading = { state: "loading" };
type Loaded<T> = { state: "loaded"; data: T };
type Error = { state: "error"; error: any };
export type ThreeState<T> = Initial | Loading | Loaded<T> | Error;

type ThreeStates = [ThreeState<any>, ...Array<ThreeState<any>>];
type ThreeStatesValues<T> = {
  [K in keyof T]: T[K] extends ThreeState<infer U> ? U : never;
};

export function whenLoaded<S extends ThreeStates, T>(
  reducer: (values: ThreeStatesValues<S>) => T
): (states: S) => ThreeState<T> {
  return (states) =>
    states.some(({ state }) => state === error)
      ? makeError(
          states
            .filter(({ state }) => state === error)
            .map(({ error }: Error) => error)
        )
      : states.some(({ state }) => state === initial)
      ? makeInitial<T>()
      : states.some(({ state }) => state === loading)
      ? makeLoading<T>()
      : makeLoaded(reducer((states as any).map(({ data }) => data)));
}

export function makeInitial<T>(): ThreeState<T> {
  return { state: initial };
}

function makeLoading<T>(): ThreeState<T> {
  return { state: loading };
}

export function makeLoaded<T>(data: T): Loaded<T> {
  return { state: loaded, data };
}

export function makeError(err: any): Error {
  return {
    state: error as "error",
    error: Array.isArray(err)
      ? err.length === 1
        ? err[0]
        : { errors: err }
      : err,
  };
}

export function lazyRefreshableThreeState<T>(promiseFactory: () => Promise<T>) {
  const once = oncer();
  const threeState = writableThreeState<T>((set) => {
    once(() => {
      set(makeLoading<T>());
      promiseFactory().then((data) => {
        set(makeLoaded(data));
      });
    });
  });

  return [
    { subscribe: threeState.subscribe },
    () => {
      threeState.setLoading();
      return promiseFactory().then((data) => {
        threeState.setLoaded(data);
      });
    },
  ] as [{ subscribe: typeof threeState.subscribe }, () => Promise<void>];
}

export function waitUntilLoaded<T>(store: Readable<ThreeState<T>>) {
  let unsubscribe: { (): void };
  return (
    new Promise<T>((resolve) => {
      unsubscribe = store.subscribe((ts) => {
        if (ts.state === loaded) {
          resolve(ts.data);
        }
      });
    })
      //deliberately not using .finally() for compatibility
      .then((v) => {
        unsubscribe();
        return v;
      })
      .catch((e) => {
        unsubscribe();
        throw e;
      })
  );
}

export function anyLoading<S extends ThreeStates>(states: S) {
  return states.some((s) => s.state === "loading");
}

export function lastValueWhileLoading<T>() {
  let hasBeenLoadedBefore = false;
  let cache: T;
  return (ts: ThreeState<T>) => {
    if (ts.state === loaded) {
      cache = ts.data;
      hasBeenLoadedBefore = true;
    }

    return ts.state === loading && hasBeenLoadedBefore ? makeLoaded(cache) : ts;
  };
}
