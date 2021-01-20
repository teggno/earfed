import { readable, writable, Readable } from "svelte/store";
import { oncer } from "./oncer";

export const initial = "initial";
export const loaded = "loaded";
export const error = "error";

export function threeStateFromPromise<T>(promise: Promise<T>) {
  return readable(makeInitial<T>(), (set) => {
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
    setError(err: any) {
      w.set(makeError(err));
    },
    subscribe: w.subscribe,
  };
}

type Initial = { state: "initial" };
type Loaded<T> = { state: "loaded"; data: T };
type Error = { state: "error"; error: any };
export type ThreeState<T> = Initial | Loaded<T> | Error;

type ThreeStates = [ThreeState<any>, ...Array<ThreeState<any>>];
type ThreeStatesValues<T> = {
  [K in keyof T]: T[K] extends ThreeState<infer U> ? U : never;
};

export function whenLoaded<S extends ThreeStates, T>(
  reducer: (values: ThreeStatesValues<S>) => T
): (states: S) => ThreeState<T> {
  return (states) =>
    states.some(({ state }) => state === initial)
      ? makeInitial<T>()
      : states.some(({ state }) => state === error)
      ? makeError(
          states
            .filter(({ state }) => state === error)
            .map(({ error }: Error) => error)
        )
      : makeLoaded(reducer((states as any).map(({ data }) => data)));
}

export function makeInitial<T>(): ThreeState<T> {
  return { state: initial };
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
    once(() =>
      promiseFactory().then((data) => {
        set(makeLoaded(data));
      })
    );
  });

  return [
    { subscribe: threeState.subscribe },
    () =>
      promiseFactory().then((data) => {
        threeState.setLoaded(data);
      }),
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
