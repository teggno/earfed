import { providerByMapping } from "./providers/providers";

export async function showSubscriptionToShow(showSubscription) {
  const provider = providerByMapping(showSubscription.providerMapping);
  if (!provider) {
    throw new Error(
      `could not determine provider for ${JSON.stringify(
        showSubscription.providerM
      )}`
    );
  }
  const fetchedShowData = await provider.fetchShow(
    showSubscription.providerMapping
  );
  const episodeFor = (episodeProviderMapping) =>
    provider.episodeFor(episodeProviderMapping, fetchedShowData.episodes);
  return {
    showId: showSubscription.showId,
    showName: fetchedShowData.showName,
    showIconUrl: fetchedShowData.showIconUrl,
    episodeFor,
  };
}
