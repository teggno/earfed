import { hitTest } from "../dom/hitTest";

const minLongPressMilliseconds = 400;
const scrollThresholdPixels = 60;
const scrollWaitMillis = 100;
const bottomBarHeight = 51;

/**
 * Makes the children of `node` orderable by using drag and drop (NOT based on
 * the browser's drag and drop api because of it not working on iOS safari and
 * chrome on android in some cases).
 * Dragging is initiated by long press on touch devices or by normal click on
 * non-touch.
 * @param {Element} node
 */
export default function orderable(node, { css: { beforeClass, afterClass } }) {
  let longPressDetectionTimeout;
  let isMouseDown = false;
  let isTouchDevice = false;

  let elementBeingDragged;
  let targetNode;
  let beforeTargetNode = false;
  let scroller;
  let yBefore;

  addEventListeners(node);

  return {
    destroy() {
      removeEventListeners(node);
    },
  };

  function addEventListeners() {
    node.addEventListener("touchstart", handleTouchStart);
    node.addEventListener("contextmenu", justPreventDefault);
    node.addEventListener("mousedown", handleMouseDown);
  }

  function removeEventListeners(node) {
    node.removeEventListener("touchstart", handleTouchStart);
    node.removeEventListener("contextmenu", justPreventDefault);
    node.removeEventListener("mousedown", handleMouseDown);
  }

  function handleMouseDown(e) {
    if (e.button !== 0 || isTouchDevice) return;
    isMouseDown = true;

    node.addEventListener("mousemove", handleMouseMove);
    // adding this to document instead of node to also be notified when the
    // mouse button is released outside of node.
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e) {
    if (!isMouseDown) return;

    if (isDragging()) {
      move(e);
    } else {
      start(getContainingLi(e.target));
    }
  }

  function handleMouseUp(e) {
    if (isDragging()) stop(!hitTest(e.clientX, e.clientY, node));

    node.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    isMouseDown = false;
  }

  function handleTouchStart(e) {
    isTouchDevice = true;
    if (e.touches.length !== 1) return;
    // we're only interested in touches of the node's descendants, not the node itself
    if (node === e.target) return;

    longPressDetectionTimeout = setTimeout(() => {
      longPressDetectionTimeout = undefined;
      start(getContainingLi(e.touches[0].target));
    }, minLongPressMilliseconds);
    node.addEventListener("touchmove", handleTouchMove);
    node.addEventListener("touchend", handleTouchEnd);
  }

  function handleTouchMove(e) {
    clearTimeoutIfApplicable();
    if (isDragging()) {
      e.preventDefault(); // prevent scrolling that's happening normally
      move(e.changedTouches[0]);
    }
  }

  function handleTouchEnd() {
    clearTimeoutIfApplicable();
    if (isDragging()) stop();

    node.removeEventListener("touchmove", handleTouchMove);
    node.removeEventListener("touchend", handleTouchEnd);
  }

  function start(li) {
    console.log("start");
    elementBeingDragged = li;
    node.dispatchEvent(
      new CustomEvent("orderstart", {
        detail: { indexOfOrderedItem: indexOfChild(node, li) },
      })
    );
  }

  function move(clientPoint) {
    console.log("move");
    if (
      yBefore !== undefined &&
      Math.abs(yBefore - clientPoint.clientY) < 0.5
    ) {
      return;
    }
    const moveTarget = elementAt(node.children, clientPoint);

    if (targetNode && moveTarget !== targetNode) {
      leave(targetNode);
      targetNode = undefined;
    }
    if (
      moveTarget &&
      moveTarget !== elementBeingDragged &&
      moveTarget !== targetNode
    ) {
      enter(moveTarget);
      targetNode = moveTarget;
    }

    if (scroller) {
      scroller.cancel();
    }
    scroller = makeScroller();
    scrollTo(clientPoint.clientY);
  }

  function stop(cancelled) {
    if (scroller) {
      scroller.cancel();
    }
    if (targetNode) leave(targetNode);

    let detail = cancelled
      ? {}
      : {
          orderedNodeIndex: indexOfChild(node, elementBeingDragged),
          targetNodeIndex: indexOfChild(node, targetNode),
          beforeTargetNode,
        };
    node.dispatchEvent(new CustomEvent("orderend", { detail }));
    elementBeingDragged = undefined;
  }

  function clearTimeoutIfApplicable() {
    if (longPressDetectionTimeout !== undefined) {
      clearTimeout(longPressDetectionTimeout);
      longPressDetectionTimeout = undefined;
    }
  }

  function enter(target) {
    const before = isBefore(target, elementBeingDragged);
    const className = getClassName(before ? beforeClass : afterClass);
    if (className) target.classList.toggle(className);
    beforeTargetNode = before;
  }

  function leave(target) {
    let className = getClassName(beforeClass);
    if (className) target.classList.remove(className);
    className = getClassName(afterClass);
    if (className) target.classList.remove(className);
  }

  function getContainingLi(element) {
    while (element && element.parentElement !== node) {
      element = element.parentElement;
    }
    return element;
  }

  function isDragging() {
    return !!elementBeingDragged;
  }

  function scrollTo(touchClientY) {
    const canScrollUp = !!window.pageYOffset;
    const touchingTopEdge = touchClientY < scrollThresholdPixels;

    const canScrollDown =
      window.pageYOffset + window.innerHeight < document.body.scrollHeight;
    const touchingBottomEdge =
      touchClientY >
      window.innerHeight - scrollThresholdPixels - bottomBarHeight;

    if (canScrollUp && touchingTopEdge) {
      const scrollThresholdRemaining =
        scrollThresholdPixels - (touchClientY < 0 ? 0 : touchClientY);
      const factor = Math.pow(
        scrollThresholdRemaining / scrollThresholdPixels,
        4
      );
      scroller.scrollUp(window.pageYOffset * factor);
    } else if (canScrollDown && touchingBottomEdge) {
      const inScrollThreshold =
        scrollThresholdPixels -
        window.innerHeight +
        bottomBarHeight +
        touchClientY;
      const factor = Math.pow(inScrollThreshold / scrollThresholdPixels, 4);
      scroller.scrollDown(
        (document.body.scrollHeight - window.pageYOffset - window.innerHeight) *
          factor
      );
    }
  }
}

/**
 *
 * @param {Element} element
 * @param {Element} otherElement
 */
function isBefore(element, otherElement) {
  return !!(
    element.compareDocumentPosition(otherElement) &
    Node.DOCUMENT_POSITION_FOLLOWING
  );
}

function getClassName(stringOrFunction) {
  return typeof stringOrFunction === "string"
    ? stringOrFunction
    : typeof stringOrFunction === "function"
    ? stringOrFunction()
    : undefined;
}

function justPreventDefault(e) {
  e.preventDefault();
}

function elementAt(elements, { clientX, clientY }) {
  for (let i = 0; i < elements.length; i++) {
    if (hitTest(clientX, clientY, elements[i])) return elements[i];
  }
  return undefined;
}

function indexOfChild(parent, child) {
  for (let i = 0; i < parent.children.length; i++) {
    if (child === parent.children[i]) return i;
  }
  return undefined;
}

function makeScroller() {
  let cancelled = false;
  function cancel() {
    cancelled = true;
  }
  async function scrollUp(scrollIncrement) {
    while (!cancelled) {
      const newScrollTop =
        window.pageYOffset < scrollIncrement
          ? 0
          : window.pageYOffset - scrollIncrement;
      window.scrollTo({ top: newScrollTop });
      await wait(scrollWaitMillis);
    }
  }
  async function scrollDown(scrollIncrement) {
    while (!cancelled) {
      const newScrollTop =
        window.pageYOffset + window.innerHeight + scrollIncrement <
        document.body.scrollHeight
          ? window.pageYOffset + scrollIncrement
          : document.body.scrollHeight - window.innerHeight;
      window.scrollTo({ top: newScrollTop });
      await wait(scrollWaitMillis);
    }
  }

  return { cancel, scrollUp, scrollDown };
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
