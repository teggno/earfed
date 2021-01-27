import { writable } from "svelte/store";
import { getContext, setContext } from "svelte";

const contextKey = {};

function makeProgressbarController() {
  const store = writable(false);
  return {
    show() {
      store.set(true);
    },
    hide() {
      store.set(false);
    },
    visible: { subscribe: store.subscribe },
  };
}

export function getGlobalProgressbar() {
  return getContext<ReturnType<typeof makeProgressbarController>>(contextKey);
}

export function initGlobalProgressbar() {
  setContext(contextKey, makeProgressbarController());
}
