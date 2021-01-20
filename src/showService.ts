import { derived } from "svelte/store";
import AppleShow from "./domain/AppleShow";
import RssShow from "./domain/RssShow";
import { Provider } from "./providers";
import { lazyRefreshableThreeState, whenLoaded } from "./threeState";
import {
  allShows,
  ShowInput,
  subscribeToShow as subscribeToShowInDb,
  unsubscribeFromShow as unsubscribeFromShowInDb,
} from "./userData/shows";
import type {
  AppleShowValue,
  RssShowValue,
  ShowId,
} from "./userData/showTypes";

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

export function showValueToShow(showValue: AppleShowValue | RssShowValue) {
  return showValue.provider === Provider.Apple
    ? new AppleShow(showValue.collection, showValue.status)
    : new RssShow(
        showValue.providerShowId,
        showValue.channel,
        showValue.status
      );
}
