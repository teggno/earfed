import { derived } from "svelte/store";
import AppleEpisode from "./domain/AppleEpisode";
import RssEpisode from "./domain/RssEpisode";
import { Provider } from "./providers";
import { lazyRefreshableThreeState, whenLoaded } from "./threeState";
import { allEpisodes } from "./userData/episodes";
import { shows as showsStore } from "./showService";
import { arrayToMap } from "./utils";
import AppleShow, { appleUniqueShowId } from "./domain/AppleShow";
import RssShow, { rssUniqueShowId } from "./domain/RssShow";
import type { ArrayElement, PromiseValue } from "./helperTypes";

const [
  userDataEpisodesStore,
  refreshUserDataEpisodes,
] = lazyRefreshableThreeState(allEpisodes);

const showsByIdStore = derived(
  [showsStore],
  whenLoaded(([shows]) => arrayToMap(shows, (s) => s.uniqueShowId))
);

const episodes = derived(
  [userDataEpisodesStore, showsByIdStore],
  whenLoaded(([episodes, showsById]) => {
    return episodes.map((e) => {
      return episodeValueToEpisode(e, showsById);
    });
  })
);

export { episodes, refreshUserDataEpisodes };

function episodeValueToEpisode(
  episode: AppleOrRssEpisode,
  showsById: { [uniqueShowId: string]: AppleShow | RssShow }
) {
  if (episode.provider === Provider.Apple) {
    const appleShow = showsById[
      appleUniqueShowId(episode.collectionId)
    ] as AppleShow;
    if (!appleShow) {
      throw new Error("missing apple show " + episode.collectionId);
    }
    return new AppleEpisode(
      episode.track,
      appleShow,
      episode.positionSeconds,
      episode.status
    );
  } else {
    const rssShow = showsById[rssUniqueShowId(episode.rssFeedUrl)] as RssShow;
    if (!rssShow) {
      throw new Error("missing rss show " + episode.rssFeedUrl);
    }
    return new RssEpisode(
      episode.item,
      rssShow,
      episode.positionSeconds,
      episode.status
    );
  }
}

type AppleOrRssEpisode = ArrayElement<
  PromiseValue<ReturnType<typeof allEpisodes>>
>;
