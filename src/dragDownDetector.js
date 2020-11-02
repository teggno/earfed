export default function dragDownDetectorFactory(callback) {
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
    },

    handleTouchEnd(e) {
      if (contiguousDownwardTouches.length === 0) return;

      const totalDistance =
        contiguousDownwardTouches[contiguousDownwardTouches.length - 1].touch
          .clientY - contiguousDownwardTouches[0].touch.clientY;
      const totalTime =
        contiguousDownwardTouches[
          contiguousDownwardTouches.length - 1
        ].time.valueOf() - contiguousDownwardTouches[0].time.valueOf();
      const totalSpeed = totalDistance / totalTime;

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
        callback();
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
