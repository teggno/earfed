export function supportsNotificationBar() {
  return "mediaSession" in navigator;
}

export function connectNotificationBar(playerService: {
  seekBackward: () => void;
  seekForward: () => void;
}) {
  if (!supportsNotificationBar()) return noOp;

  // adapted from https://developers.google.com/web/updates/2017/02/media-session

  navigator.mediaSession!.setActionHandler(
    "seekbackward",
    playerService.seekBackward
  );
  navigator.mediaSession!.setActionHandler(
    "seekforward",
    playerService.seekForward
  );

  return (episode: {
    episodeTitle: string;
    showTitle: string;
    showImageUrlMedium: string | undefined;
  }) => {
    navigator.mediaSession!.metadata = new MediaMetadata({
      title: episode.episodeTitle,
      artist: episode.showTitle,
      album: "",
      artwork: episode.showImageUrlMedium
        ? [
            {
              src: episode.showImageUrlMedium,
              sizes: "512x512",
              type: "image/png",
            },
          ]
        : [],
    });
  };
}

function noOp() {}
