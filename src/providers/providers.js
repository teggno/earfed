import * as providerApple from "./apple/providerApple";
import * as providerRss from "./rss/providerRss";

const providers = [providerApple, providerRss];

export function providerByMapping(providerMapping) {
  return providers.find((p) => p.providerFor(providerMapping));
}
