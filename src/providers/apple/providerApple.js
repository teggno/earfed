export function showProviderMapping(collectionId) {
  return { collectionId };
}

export function providerFor(showProviderMapping) {
  return typeof showProviderMapping.collectionId !== "undefined";
}

export function fetchShow(showProviderMapping) {
  // TODO: fetch the json with the show's data (title, description and stuff)
}
