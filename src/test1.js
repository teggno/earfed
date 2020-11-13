import * as fs from "fs";
import * as path from "path";
import * as xmldom from "xmldom";
import { fileURLToPath } from "url";
import { parseShowFeed } from "./showRssFeed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function test(text, fn) {
  console.log("running", text);
  fn();
  console.log("done running", text);
}

test("parses sampleFeed.xml", () => {
  const parser = new xmldom.DOMParser();

  const xmlString = fs
    .readFileSync(path.join(__dirname, "/../sampleData/sampleFeed.xml"))
    .toString();
  // console.log(xmlString);
  const xmlFeedDocument = parser.parseFromString(xmlString, "application/xml");
  // console.log(xmlFeedDocument.documentElement);
  const actual = parseShowFeed(xmlFeedDocument);
  console.log(actual);
});
