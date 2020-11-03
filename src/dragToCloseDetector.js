const minDragPixelsToClose = 30;
const minDragSpeedToClise = 0.5;

export default function dragDownDetectorFactory(
  dragEndCallback,
  draggingCallback
) {
  draggingCallback = draggingCallback || (() => {});
  let contiguousDownwardTouches = [];
  let targetScrollTopsAtFirstTouch = [];

  return {
    handleTouchStart(e) {
      if (e.touches.length !== 1) return;

      const currentTouch = e.touches[0];
      contiguousDownwardTouches = [timedTouch(currentTouch)];
      targetScrollTopsAtFirstTouch = elementAndAncestorsScrollTops(
        currentTouch.target
      );
    },

    handleTouchMove(e) {
      if (e.changedTouches.length !== 1) return;

      const currentTouch = e.changedTouches[0];
      if (isScrolled(currentTouch.target)) {
        return;
      }

      if (movedUp(lastElement(contiguousDownwardTouches).touch, currentTouch)) {
        contiguousDownwardTouches = [timedTouch(currentTouch)];
        return;
      }

      contiguousDownwardTouches = [
        ...contiguousDownwardTouches,
        { touch: currentTouch, time: new Date() },
      ];

      const dragDownDistance =
        currentTouch.clientY -
          contiguousDownwardTouches[contiguousDownwardTouches.length - 2]?.touch
            ?.clientY || 0;
      if (dragDownDistance !== 0) draggingCallback(dragDownDistance);
    },

    handleTouchEnd(e) {
      const firstItem = contiguousDownwardTouches[0];
      const lastItem = lastElement(contiguousDownwardTouches);
      const totalDistance =
        firstItem && lastItem
          ? lastItem.touch.clientY - firstItem.touch.clientY
          : 0;
      const totalTime =
        firstItem && lastItem
          ? lastItem.time.valueOf() - firstItem.time.valueOf()
          : 0;
      const totalSpeed =
        totalTime === 0 ? undefined : totalDistance / totalTime;

      const newScrollTops = elementAndAncestorsScrollTops(
        e.changedTouches[0].target
      ).map((t) => (t < 0 ? 0 : t));
      // note to the map() above replacing negative values with zeros: This is for the
      // bouncy scroll behavior on iOS Safari
      if (
        totalDistance > minDragPixelsToClose &&
        totalSpeed > minDragSpeedToClise &&
        areNumberArraysEqual(targetScrollTopsAtFirstTouch, newScrollTops)
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

function lastElement(array) {
  return array[array.length - 1];
}

function timedTouch(touch) {
  return { touch, time: new Date() };
}

function isScrolled(element) {
  return elementAndAncestorsScrollTops(element).some((t) => t > 0);
}
