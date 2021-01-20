declare var MediaMetadata: any;

interface Navigator {
  mediaSession?: {
    setActionHandler(event: "seekbackward" | "seekforward", handler: any);
    metadata: any;
  };
}
