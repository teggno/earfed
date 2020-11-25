export function areEpisodesEqual(a, b) {
  return a && b && areEpisodeIdsEqual(a.episodeId, b.episodeId);
}

function areEpisodeIdsEqual(a, b) {
  return (
    a.provider === b.provider && a.providerEpisodeId === b.providerEpisodeId
  );
}
