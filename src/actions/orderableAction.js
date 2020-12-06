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
  let elementBeingDraggedPosition;
  let targetNode;
  let beforeTargetNode = false;
  let scroller;
  let yBefore;
  let pointerStartTopLeft;
  let ghost;
  let settingGhostPosition = false;

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

    document.addEventListener("mousemove", handleMouseMove);
    // adding this to document instead of node to also be notified when the
    // mouse button is released outside of node.
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e) {
    if (!isMouseDown) return;

    if (isDragging()) {
      move(e);
    } else {
      start(getContainingLi(e.target), e);
    }
  }

  function handleMouseUp(e) {
    if (isDragging()) stop(!hitTest(e.clientX, e.clientY, node));

    document.removeEventListener("mousemove", handleMouseMove);
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
      start(getContainingLi(e.touches[0].target), e.touches[0]);
    }, minLongPressMilliseconds);
    node.addEventListener("touchmove", handleTouchMove);
    node.addEventListener("touchend", handleTouchEnd);
  }

  function handleTouchMove(e) {
    if (e.changedTouches.length !== 1) return;
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

  function start(li, pointerTopLeft) {
    elementBeingDragged = li;
    const {
      x: clientX,
      y: clientY,
    } = elementBeingDragged.getBoundingClientRect();
    elementBeingDraggedPosition = { clientX, clientY };
    pointerStartTopLeft = {
      clientX: pointerTopLeft.clientX,
      clientY: pointerTopLeft.clientY,
    };
    ghost = createGhost();
    setGhostPosition(pointerTopLeft);
    requestAnimationFrame(() => {
      document.body.appendChild(ghost);
      requestAnimationFrame(() => {
        ghost.style.boxShadow = "var(--now-playing-shadow)";
        ghost.style.opacity = 1;
      });
    });
    elementBeingDragged.style.opacity = 0.6;

    node.dispatchEvent(
      new CustomEvent("orderstart", {
        detail: { indexOfOrderedItem: indexOfChild(node, li) },
      })
    );
  }

  function createGhost() {
    const clone = elementBeingDragged.cloneNode(true);
    const rect = elementBeingDragged.getBoundingClientRect();
    let element;
    if (clone.tagName === "LI") {
      element = document.createElement("ul");
      element.style.listStyle = "none";
      element.style.padding = 0;
      element.style.margin = 0;
      element.appendChild(clone);
    } else {
      element = clone;
    }
    element.style.zIndex = 10;
    element.style.position = "fixed";
    element.style.width = rect.width + "px";
    element.style.height = rect.height + "px";
    element.style.transition = "opacity 400ms ease, box-shadow 400ms ease";
    element.style.backgroundColor = "white";
    element.style.opacity = 0;
    // necessary because when using touch, longpress might show the context menu
    element.addEventListener("contextmenu", (e) => e.preventDefault());
    return element;
  }

  function ghostTopLeft(pointerTopLeft) {
    return pointerStartTopLeft && elementBeingDraggedPosition
      ? {
          clientX: ghostCoord(
            pointerTopLeft.clientX,
            pointerStartTopLeft.clientX,
            elementBeingDraggedPosition.clientX
          ),
          clientY: ghostCoord(
            pointerTopLeft.clientY,
            pointerStartTopLeft.clientY,
            elementBeingDraggedPosition.clientY
          ),
        }
      : undefined;
  }

  function setGhostPosition(pointerTopLeft) {
    const coords = ghostTopLeft(pointerTopLeft);
    if (!coords) return;
    ghost.style.left = coords.clientX + "px";
    ghost.style.top = coords.clientY + "px";
  }

  function move(clientPoint) {
    if (
      yBefore !== undefined &&
      Math.abs(yBefore - clientPoint.clientY) < 0.5
    ) {
      return;
    }

    setMoveTarget(clientPoint);

    if (scroller) {
      scroller.cancel();
    }
    scroller = makeScroller(() => {
      setMoveTarget(clientPoint);
    });
    scrollTo(clientPoint.clientY);

    if (!settingGhostPosition) {
      settingGhostPosition = true;
      requestAnimationFrame(() => {
        setGhostPosition(clientPoint);
        settingGhostPosition = false;
      });
    }
  }

  function setMoveTarget(clientPoint) {
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
  }

  function stop(cancelled) {
    if (scroller) {
      scroller.cancel();
    }
    if (targetNode) leave(targetNode);

    const hasReordered =
      !cancelled && targetNode && elementBeingDragged !== targetNode;
    const detail = hasReordered
      ? {
          orderedNodeIndex: indexOfChild(node, elementBeingDragged),
          targetNodeIndex: indexOfChild(node, targetNode),
          beforeTargetNode,
        }
      : {};
    node.dispatchEvent(new CustomEvent("orderend", { detail }));
    elementBeingDragged.style.opacity = 1;

    if (ghost) {
      const targetRect = (hasReordered
        ? targetNode
        : elementBeingDragged
      ).getBoundingClientRect();
      ghost.style.left = targetRect.x + "px";
      ghost.style.top = targetRect.y + "px";
      ghost.style.boxShadow = "none";
      ghost.style.transition = "all 100ms cubic-bezier(0.11, 0, 0.5, 0)";
      let g = ghost;
      ghost = undefined;
      setTimeout(() => {
        document.body.removeChild(g);
      }, 100);
    }
    elementBeingDragged = undefined;
    targetNode = undefined;
    pointerStartTopLeft = undefined;
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

function makeScroller(scrolled) {
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
      scrolled();
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
      scrolled();
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

function ghostCoord(pointerCoord, pointerStartCoord, elementBeingDraggedCoord) {
  return pointerCoord - pointerStartCoord + elementBeingDraggedCoord;
}
