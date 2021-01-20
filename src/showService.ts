import { derived } from "svelte/store";
import AppleShow from "./domain/AppleShow";
import RssShow from "./domain/RssShow";
import type { ArrayElement, PromiseValue } from "./helperTypes";
import { Provider } from "./providers";
import { lazyRefreshableThreeState, whenLoaded } from "./threeState";
import {
  allShows,
  ShowInput,
  subscribeToShow as subscribeToShowInDb,
  unsubscribeFromShow as unsubscribeFromShowInDb,
} from "./userData/shows";
import type { ShowId } from "./userData/showTypes";

const [userDataShowsState, refreshShows] = lazyRefreshableThreeState(allShows);

const shows = derived(
  [userDataShowsState],
  whenLoaded(([s]) => s.map(showValueToShow))
);
export { shows, refreshShows };

export async function subscribeToShow(showInput: ShowInput) {
  await subscribeToShowInDb(showInput, new Date());
  refreshShows();
}

export async function unsubscribeFromShow(showId: ShowId) {
  await unsubscribeFromShowInDb(showId, new Date());
  refreshShows();
}

export function showValueToShow(showValue: AppleOrRssEpisode) {
  return showValue.provider === Provider.Apple
    ? new AppleShow(showValue.collection, showValue.status)
    : new RssShow(showValue.rssFeedUrl, showValue.channel, showValue.status);
}

type AppleOrRssEpisode = ArrayElement<
  PromiseValue<ReturnType<typeof allShows>>
>;
