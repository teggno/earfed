import makeLinksExternal from "./makeLinksExternal";
import makeSanitizedCopy from "./makeSanitizedCopy";

export default function sanitizeHtml(htmlString) {
  const wrapperDivString = `<div>${htmlString}</div>`;
  const document = new DOMParser().parseFromString(
    wrapperDivString,
    "text/html"
  );
  // document.documentElement.tagName is always "HTML" and it always contains a "BODY"
  // which contains our sourceHtml.
  const body = document.querySelector("body");
  const wrapperDiv = body.firstChild;
  const copy = makeSanitizedCopy(wrapperDiv);
  if (!copy) return "";
  body.removeChild(wrapperDiv);
  body.appendChild(copy);
  makeLinksExternal(copy);
  return copy.innerHTML;
}
