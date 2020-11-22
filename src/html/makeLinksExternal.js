/**
 * Adds `target="_blank"` to all `<a>` nodes contained in the node. If there
 * already is a `target` attribute, changes it to `_blank`.
 * @param {Element} element
 */
export default function makeLinksExternal(element) {
  console.log("makeLinksExternal");
  element.querySelectorAll("a").forEach((anchor) => {
    console.log("anchor");
    anchor.setAttribute("target", "_blank");
  });
}
