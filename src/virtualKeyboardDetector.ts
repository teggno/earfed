const maxMillisBetweenFocusAndResize = 320;
const minKeyboardHeight = 180;

export const virtualkeyboard = "virtualkeyboard";

/**
 * Tries to detect when the virtual keyboard (e.g. on a touch device like a
 * phone) has just been shown or hidden. When it detects that the keyboard has
 * been shown, it dispatches an event `virtualkeyboard` on `window` with an
 * `event` argument containing `detail: {visible: true}` and when it detects the
 * keyboard has just been hidden, it will be `detail: {visible: false}`.
 * @returns A function to be called when virtual keyboard detection is no longer
 * needed.
 */
export default function virtualKeyboardDetector() {
  document.addEventListener("focusin", handleFocusIn);
  /**
   * Removes event listeners. To be called when virtual virtual keyboard
   * detection is no longer needed.
   */
  const destroy = () => {
    document.removeEventListener("focusin", handleFocusIn);
  };

  return destroy;
}

function handleFocusIn(e) {
  if (e.target.tagName !== "INPUT") return;

  let focusInTime = new Date();
  let heightBefore = window.innerHeight;
  let widthBefore = window.innerWidth;
  let resizeEventListenerAdded = true;

  window.addEventListener("resize", handleResizeWhileShowing);

  // there might not be any resize happening upon focus (e.g. when not on mobile)
  // so remove the listener after some time.
  setTimeout(() => {
    if (resizeEventListenerAdded) {
      window.removeEventListener("resize", handleResizeWhileShowing);
      resizeEventListenerAdded = false;
    }
  }, maxMillisBetweenFocusAndResize + 100);

  function handleResizeWhileShowing() {
    window.removeEventListener("resize", handleResizeWhileShowing);
    resizeEventListenerAdded = false;
    const millisBetweenFocusAndResize =
      new Date().valueOf() - focusInTime.valueOf();
    const timeBetweenFocusAndResizeShortEnough =
      millisBetweenFocusAndResize < maxMillisBetweenFocusAndResize;
    const lostAppropriateHeight =
      heightBefore - window.innerHeight > minKeyboardHeight;
    const widthStillTheSame = widthBefore === window.innerWidth;

    if (
      timeBetweenFocusAndResizeShortEnough &&
      lostAppropriateHeight &&
      widthStillTheSame
    ) {
      window.addEventListener("resize", handleResizeWhileHiding);
      window.dispatchEvent(
        new CustomEvent(virtualkeyboard, { detail: { visible: true } })
      );
    }

    function handleResizeWhileHiding() {
      window.removeEventListener("resize", handleResizeWhileHiding);
      window.dispatchEvent(
        new CustomEvent(virtualkeyboard, { detail: { visible: false } })
      );
    }
  }
}
