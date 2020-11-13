export default function parseXmlString(xmlString) {
  return new DOMParser().parseFromString(xmlString, "application/xml");
}
