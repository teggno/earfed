// adapted from https://github.com/jitbit/HtmlSanitizer/blob/master/HtmlSanitizer.js
const tagWhitelist = [
  "A",
  "ABBR",
  "B",
  "BLOCKQUOTE",
  "BODY",
  "BR",
  "CENTER",
  "CODE",
  "DIV",
  "EM",
  "FONT",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HR",
  "I",
  "IMG",
  "LABEL",
  "LI",
  "OL",
  "P",
  "PRE",
  "SMALL",
  "SOURCE",
  "SPAN",
  "STRONG",
  "TABLE",
  "TBODY",
  "TR",
  "TD",
  "TH",
  "THEAD",
  "UL",
  "U",
  "VIDEO",
];

const attributeWhitelist = [
  "align",
  "color",
  "height",
  "href",
  "src",
  "style",
  "target",
  "title",
  "type",
  "width",
];

const cssWhitelist = [
  "color",
  "background-color",
  "font-size",
  "text-align",
  "text-decoration",
  "font-weight",
];

const schemaWhiteList = [
  "http:",
  "https:",
  "data:",
  "m-files:",
  "file:",
  "ftp:",
]; //which "protocols" are allowed in "href", "src" etc

const attributesContainingUri = ["href"];

const tagWhitelistMap = arrayToMap(tagWhitelist);
const attributeWhitelistMap = arrayToMap(attributeWhitelist);
const cssWhitelistMap = arrayToMap(cssWhitelist);
const attributesContainingUriMap = arrayToMap(attributesContainingUri);

/**
 *
 * @param {Node} sourceNode
 * @returns {(Node|undefined)}
 */
export default function makeSanitizedCopy(sourceNode) {
  let newNode;
  if (
    sourceNode.nodeType == Node.ELEMENT_NODE &&
    tagWhitelistMap[sourceNode.tagName]
  ) {
    newNode = sourceNode.ownerDocument.createElement(sourceNode.tagName);
    copyAttributes(sourceNode, newNode);
    copyStyles(sourceNode.style, newNode.style);

    sourceNode.childNodes.forEach((childNode) => {
      var subCopy = makeSanitizedCopy(childNode);
      if (subCopy) {
        newNode.appendChild(subCopy);
      }
    });
  } else if (sourceNode.nodeType == Node.TEXT_NODE) {
    newNode = sourceNode.cloneNode(true);
  }
  return newNode;
}

/**
 *
 * @param {Element} sourceElement
 * @param {Element} targetElement
 */
function copyAttributes(sourceElement, targetElement) {
  for (let i = 0; i < sourceElement.attributes.length; i++) {
    const attr = sourceElement.attributes[i];
    if (!attributeWhitelistMap[attr.name]) return;

    if (
      attr.name !== "style" &&
      (!attributesContainingUriMap[attr.name] ||
        attr.value.indexOf(":") === -1 ||
        schemaWhiteList.some((schema) => attr.value.indexOf(schema) !== -1))
    ) {
      //if this is a "uri" attribute, that can have "javascript:" or something
      targetElement.setAttribute(attr.name, attr.value);
    }
  }
}

/**
 *
 * @param {CSSStyleDeclaration} sourceStyles
 * @param {CSSStyleDeclaration} targetStyles
 */
function copyStyles(sourceStyles, targetStyles) {
  for (let i = 0; i < sourceStyles.length; i++) {
    const styleName = sourceStyles[i];
    if (cssWhitelistMap[styleName])
      targetStyles.setProperty(
        styleName,
        sourceStyles.getPropertyValue(styleName)
      );
  }
}

function arrayToMap(array) {
  return array.reduce((map, tag) => {
    map[tag] = true;
    return map;
  }, {});
}
