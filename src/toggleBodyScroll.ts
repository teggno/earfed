let scrollingEnabled = true;

let offsetBeforeScrollDisabled = 0;

// Disable scrolling of body. This is used to prevent body scrolling while
// a modal is open. Was it not for iOS Safari, this would be easily solved
// with just `body.style.overflow = "hidden"`. But for iOS Safari we need
// this more complicated way to do it.

export function disable() {
  if (!scrollingEnabled) return;

  offsetBeforeScrollDisabled = window.scrollY;

  document.body.style.position = "fixed";
  document.body.style.overflow = "hidden";
  document.body.style.top = `-${offsetBeforeScrollDisabled}px`;
  scrollingEnabled = false;
}

export function enable() {
  if (scrollingEnabled) return;

  document.body.style.removeProperty("position");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("top");
  window.scrollTo(0, offsetBeforeScrollDisabled);
  scrollingEnabled = true;
}
