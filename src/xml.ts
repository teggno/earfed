export default function parseXmlString(xmlString: string) {
  return new DOMParser().parseFromString(xmlString, "application/xml");
}
