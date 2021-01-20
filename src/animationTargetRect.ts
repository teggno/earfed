import { getContext, setContext } from "svelte";
import { writable, Writable } from "svelte/store";

const contextKey = {};

export function initAnimationTargetRect() {
  const rect = writable({ top: 0, left: 0, width: 0, height: 0 });
  setContext(contextKey, rect);
}

export function animationTargetRectSetterFactory() {
  const store = getContextTyped();
  return (rect: Rect) => store.set(rect);
}

export function getAnimationTargetRect() {
  return { subscribe: getContextTyped().subscribe };
}

function getContextTyped() {
  return getContext<Writable<Rect>>(contextKey);
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}
