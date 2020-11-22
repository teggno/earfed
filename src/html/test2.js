import makeSanitizedCopy from "./makeSanitizedCopy.js";
import jsdom, { JSDOM } from "jsdom";

test_make_sanitized_copy();

function test_make_sanitized_copy() {
  const sourceHtml =
    '<div onclick="alert()" style="color:blue">hello<script src="abc.js"></script></div>';
  const jsdom = new JSDOM(sourceHtml);
  const DOMParser = jsdom.window.DOMParser;
  const document = new DOMParser().parseFromString(sourceHtml, "text/html");
  global.Node = jsdom.window.Node;
  // document.documentElement.tagName is always "HTML" and it always contains a "BODY"
  // most likely contains our sourceHtml.
  const elementCorrespondingToSourceHtml = document.querySelector("body")
    .firstChild;

  const copy = makeSanitizedCopy(elementCorrespondingToSourceHtml);
  if (!copy) {
    console.log("empty result");
    return;
  }
  console.log(copy);
  console.log(copy.outerHTML);
}
