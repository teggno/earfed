/**
 * Makes the children of `node` orderable by using drag and drop (NOT based on
 * the browser's drag and drop api because of it not working on iOS safari and
 * chrome on android in some cases).
 * @param {Element} node
 */
export default function orderable(node, { css: { beforeClass, afterClass } }) {
  addEventListeners(node);
  let elementBeingDragged;
  let targetNode;
  let beforeTargetNode = false;

  return {
    destroy() {
      removeEventListeners(node);
    },
  };

  function addEventListeners() {
    node.addEventListener("dragstart", handleDragStart);
    node.addEventListener("dragend", handleDragEnd);
    node.addEventListener("dragenter", handleDragEnter);
    node.addEventListener("dragleave", handleDragLeave);
  }

  function removeEventListeners(node) {
    node.removeEventListener("dragstart", handleDragStart);
    node.removeEventListener("dragend", handleDragEnd);
    node.removeEventListener("dragenter", handleDragEnter);
    node.removeEventListener("dragleave", handleDragLeave);
  }

  function handleDragStart(e) {
    console.log("dragstart");
    elementBeingDragged = e.target;
  }

  function handleDragEnd(e) {
    console.log("dragend");
    node.dispatchEvent(
      new CustomEvent("order", {
        detail: {
          orderedNode: elementBeingDragged,
          targetNode,
          beforeTargetNode,
        },
      })
    );
  }

  function handleDragEnter(e) {
    e.preventDefault();
    console.log("dragenter");

    const target = getDragTarget(e.target);
    if (!target || target === elementBeingDragged) return;

    const before = isBefore(target, elementBeingDragged);
    const className = getClassName(before ? beforeClass : afterClass);
    if (className) target.classList.toggle(className);

    targetNode = target;
    beforeTargetNode = before;
  }

  function handleDragLeave(e) {
    e.preventDefault();
    console.log("dragleave");

    const target = getDragTarget(e.target);
    if (!target || target === elementBeingDragged) return;

    let className = getClassName(beforeClass);
    if (className) target.classList.remove(className);
    className = getClassName(afterClass);
    if (className) target.classList.remove(className);
  }

  function getDragTarget(element) {
    while (element && element.parentElement !== node) {
      element = element.parentElement;
    }
    return element;
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
