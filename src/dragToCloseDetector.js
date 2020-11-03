const minDragDownPixelsToClose = 30;
const minDragSpeedToClose = 0.5;

export default function dragDownDetectorFactory(
  dragEndCallback,
  draggingCallback
) {
  draggingCallback = draggingCallback || (() => {});
  let contiguousDownwardTouches = [];
  let targetScrollTopsAtTouchStart = [];

  return {
    handleTouchStart(e) {
      if (e.touches.length !== 1) return;

      const currentTouch = e.touches[0];

      if (isElementOrAncestorsScrolled(currentTouch.target)) {
        console.log("scrolled");
        // The current touch scrolls the touched element or one of its ancestors
        // so this touch is of no use.
        // TODO: This might cause a bug if some ancestor element is scrolled down but
        // has overflow: hidden. In that case the move must be used.
        return;
      }

      contiguousDownwardTouches = [touchWithTime(currentTouch)];
      targetScrollTopsAtTouchStart = elementAndAncestorsScrollTops(
        currentTouch.target
      );
    },

    handleTouchMove(e) {
      if (e.changedTouches.length !== 1) return;

      const previousTouch = lastElement(contiguousDownwardTouches);
      const currentTouch = e.changedTouches[0];
      if (movedUp(previousTouch, currentTouch)) {
        contiguousDownwardTouches = [touchWithTime(currentTouch)];
        return;
      }

      contiguousDownwardTouches = [
        ...contiguousDownwardTouches,
        touchWithTime(currentTouch),
      ];

      const dragDownDistance =
        currentTouch.clientY -
          contiguousDownwardTouches[contiguousDownwardTouches.length - 2]?.touch
            ?.clientY || 0;
      if (dragDownDistance !== 0) draggingCallback(dragDownDistance);
    },

    handleTouchEnd(e) {
      const firstTimedTouch = contiguousDownwardTouches[0];
      const lastTimedTouch = lastElement(contiguousDownwardTouches);
      const totalDistance =
        firstTimedTouch && lastTimedTouch
          ? lastTimedTouch.touch.clientY - firstTimedTouch.touch.clientY
          : 0;
      const totalTime =
        firstTimedTouch && lastTimedTouch
          ? lastTimedTouch.time.valueOf() - firstTimedTouch.time.valueOf()
          : 0;
      const totalSpeed =
        totalTime === 0 ? undefined : totalDistance / totalTime;

      // note to the map() below replacing negative values with zeros: This is for the
      // bouncy scroll behavior on iOS Safari
      const newScrollTops = elementAndAncestorsScrollTops(
        e.changedTouches[0].target
      ).map((t) => (t < 0 ? 0 : t));
      if (
        totalDistance > minDragDownPixelsToClose &&
        totalSpeed > minDragSpeedToClose &&
        areNumberArraysEqual(targetScrollTopsAtTouchStart, newScrollTops)
      ) {
        dragEndCallback(true);
      } else {
        dragEndCallback(false);
      }
    },
  };
}

function movedUp(touch1, touch2) {
  return touch1.clientY > touch2.clientY;
}

function elementAndAncestorsScrollTops(element) {
  const result = [];
  while (element) {
    result.push(element.scrollTop);
    element = element.parentElement;
  }
  return result;
}

function areNumberArraysEqual(a, b) {
  if (a.length !== b.length) return false;

  if (a.length === 0 && b.length === 0) return true;

  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

function touchWithTime(touch) {
  return { touch, time: new Date() };
}

function isElementOrAncestorsScrolled(element) {
  return elementAndAncestorsScrollTops(element).some((t) => t > 0);
}

function lastElement(array) {
  return array[array.length - 1];
}
