export default function dragDownDetectorFactory(callback) {
  let previousTouch;
  let contiguousDownwardTouches = [];

  return {
    handleTouchStart(e) {
      if (e.touches.length !== 1) return;

      console.log("start: touching 1 point");
      contiguousDownwardTouches = [];
      previousTouch = e.touches[0];
    },

    handleTouchMove(e) {
      if (e.changedTouches.length !== 1) return;

      console.log("move: touching 1 point");
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

    handleTouchEnd() {
      if (contiguousDownwardTouches.length === 0) return;

      const totalDistance =
        contiguousDownwardTouches[contiguousDownwardTouches.length - 1].touch
          .clientY - contiguousDownwardTouches[0].touch.clientY;
      const totalTime =
        contiguousDownwardTouches[
          contiguousDownwardTouches.length - 1
        ].time.valueOf() - contiguousDownwardTouches[0].time.valueOf();
      const totalSpeed = totalDistance / totalTime;

      if (totalDistance > 40 && totalSpeed > 0.4) {
        callback();
      }
    },
  };
}

function movedUp(touch1, touch2) {
  return touch1.clientY > touch2.clientY;
}
