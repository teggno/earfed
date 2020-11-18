import { allShowSubscriptions } from "./userData/showSubscriptions";
import { showSubscriptionToShow } from "./showService";
import { allEpisodesNotDeleted } from "./userData/episdes";
import { arrayToMap } from "./utils";

export default async function getPlaylist() {
  const userDataShows = await allShowSubscriptions();
  const showPromises = userDataShows.map((ss) => showSubscriptionToShow(ss));
  const shows = await Promise.all(showPromises);

  const showsById = arrayToMap(shows, (s) => s.showId);

  const userDataEpisodes = await allEpisodesNotDeleted();
  return userDataEpisodes
    .map((e) => {
      const show = showsById[e.showId];
      if (!show) {
        console.warn("no show", e.showId);
        return;
      }
      const episode = show.episodeFor(e.providerMapping);
      return {
        showImageUrl: show.showImageUrl,
        showTitle: show.showTitle,
        ...episode,
      };
    })
    .filter((e) => e);
}
