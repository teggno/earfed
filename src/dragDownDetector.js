export default function dragDownDetectorFactory(
  dragEndCallback,
  draggingCallback
) {
  draggingCallback = draggingCallback || (() => {});
  let previousTouch;
  let contiguousDownwardTouches = [];
  let targetScrollTopsAtFirstTouch = [];

  return {
    handleTouchStart(e) {
      if (e.touches.length !== 1) return;

      contiguousDownwardTouches = [];
      previousTouch = e.touches[0];
      targetScrollTopsAtFirstTouch = elementAndAncestorsScrollTops(
        e.touches[0].target
      );
    },

    handleTouchMove(e) {
      if (e.changedTouches.length !== 1) return;

      const mightBeScrollingDown = elementAndAncestorsScrollTops(
        e.changedTouches[0].target
      ).some((t) => t > 0);
      if (mightBeScrollingDown) {
        return;
      }

      const currentTouch = e.changedTouches[0];
      if (movedUp(previousTouch, currentTouch)) {
        contiguousDownwardTouches = [];
        return;
      }

      contiguousDownwardTouches = [
        ...contiguousDownwardTouches,
        { touch: currentTouch, time: new Date() },
      ];

      previousTouch = currentTouch;
      const dragDownDistance =
        contiguousDownwardTouches[contiguousDownwardTouches.length - 1].touch
          .clientY -
          contiguousDownwardTouches[contiguousDownwardTouches.length - 2]?.touch
            ?.clientY || 0;
      console.log(dragDownDistance);
      if (dragDownDistance !== 0) draggingCallback(dragDownDistance);
    },

    handleTouchEnd(e) {
      const firstItem = contiguousDownwardTouches[0];
      const lastItem =
        contiguousDownwardTouches[contiguousDownwardTouches.length - 1];
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
        totalDistance > 30 &&
        totalSpeed > 0.5 &&
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
