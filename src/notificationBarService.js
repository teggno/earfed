import { showImageUrlMedium } from "./config";

export function connectNotificationBar(playerService) {
  if (!("mediaSession" in navigator)) return noOp;

  // adapted from https://developers.google.com/web/updates/2017/02/media-session

  navigator.mediaSession.setActionHandler(
    "seekbackward",
    playerService.seekBackward
  );
  navigator.mediaSession.setActionHandler(
    "seekforward",
    playerService.seekForward
  );
  // navigator.mediaSession.setActionHandler('previoustrack', function() {});
  // navigator.mediaSession.setActionHandler('nexttrack', function() {});
  return (episode) => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: episode.episodeTitle,
      artist: episode.showTitle,
      album: "",
      artwork: [
        {
          src: showImageUrlMedium(episode.showImageUrl),
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });
  };
}

function noOp() {}
