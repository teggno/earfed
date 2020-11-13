import { allShowSubscriptions } from "./userData/showSubscriptions";

export default async function getPlaylist() {
  const showSubscriptions = await allShowSubscriptions();
  const allShowsPromises = showSubscriptions.map((showSubscription) =>
    showSubscription.fetchShow()
  );
  const allShows = await Promise.all(allShowsPromises);
  return allShows.flatMap((show) =>
    show.episodes.map((episode) => ({ ...show, ...episode }))
  );
}
