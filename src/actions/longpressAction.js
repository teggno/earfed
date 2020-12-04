const minLongPressMilliseconds = 400;

export default function longpress(node) {
  addEventListeners();
  let timeout;

  return {
    destroy() {
      removeEventListeners();
    },
  };

  function addEventListeners() {
    node.addEventListener("touchstart", handleTouchStart);
    node.addEventListener("contextmenu", handleContextMenu);
  }

  function removeEventListeners() {
    removeEventListeners("touchstart", handleTouchStart);
    removeEventListeners("contextmenu", handleContextMenu);
  }

  function handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    if (node === e.target) return; // we're only interested in touches of the node's descendants, not the node itself

    timeout = setTimeout(() => {
      timeout = undefined;
      node.dispatchEvent(new CustomEvent("longpress", {}));
    }, minLongPressMilliseconds);
    node.addEventListener("touchmove", handleTouchMove);
    node.addEventListener("touchend", handleTouchEnd);
  }

  function handleTouchMove() {
    clearTimeoutIfApplicable();
  }

  function handleTouchEnd() {
    clearTimeoutIfApplicable();
    node.removeEventListener("touchmove", handleTouchMove);
    node.removeEventListener("touchend", handleTouchEnd);
  }

  function clearTimeoutIfApplicable() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  }
}

function handleContextMenu(e) {
  e.preventDefault();
}
