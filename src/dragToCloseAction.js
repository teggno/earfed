import dragDownDetectorFactory from "./dragToCloseDetector";

export default function dragToClose(node) {
  const detector = dragDownDetectorFactory(dragEndCallback, draggingCallback);
  node.addEventListener("touchstart", handleTouchStart);

  function handleTouchStart(e) {
    node.addEventListener("touchmove", detector.handleTouchMove);
    node.addEventListener("touchend", handleTouchEnd);

    detector.handleTouchStart(e);
  }

  function handleTouchEnd(e) {
    node.removeEventListener("touchmove", detector.handleTouchMove);
    node.removeEventListener("touchmove", handleTouchEnd);

    detector.handleTouchEnd(e);
  }

  function draggingCallback(pixels) {
    node.dispatchEvent(new CustomEvent("dragdown", { detail: { pixels } }));
  }

  function dragEndCallback(close) {
    if (close) {
      node.dispatchEvent(new CustomEvent("closethroughdrag"));
    } else {
      node.dispatchEvent(new CustomEvent("dragend"));
    }
  }

  return {
    destroy() {
      node.removeEventListener("touchstart", handleTouchStart);
    },
  };
}
