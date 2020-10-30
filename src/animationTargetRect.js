import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

const contextKey = {};

export function initAnimationTargetRect() {
  const rect = writable({ top: 0, left: 0, width: 0, height: 0 });
  setContext(contextKey, rect);
}

export function animationTargetRectSetterFactory() {
  const store = getContext(contextKey);
  return (rect) => store.set(rect);
}

export function getAnimationTargetRect() {
  return { subscribe: getContext(contextKey).subscribe };
}
