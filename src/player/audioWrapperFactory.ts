import { seekBackwardSeconds, seekForwardSeconds } from "./playerConstants";

export default function audioWrapperFactory(audio: HTMLAudioElement) {
  let pendingPause = false;
  let pendingPlay = false;

  function playSuccess() {
    pendingPlay = false;
    if (pendingPause) {
      pendingPause = false;
      audio.pause();
    }
  }

  return {
    setEpisodeUrl(episodeUrl?: string) {
      if (episodeUrl) {
        audio.src = episodeUrl;
      } else {
        audio.removeAttribute("src");
        audio.load();
      }
    },
    play() {
      pendingPlay = true;
      pendingPause = false;
      audio.play()?.then(playSuccess) || playSuccess();
    },
    seek(second: number) {
      audio.currentTime = second;
    },
    seekBackward() {
      audio.currentTime = Math.max(0, audio.currentTime - seekBackwardSeconds);
    },
    seekForward() {
      audio.currentTime = Math.min(
        audio.duration,
        audio.currentTime + seekForwardSeconds
      );
    },
    pause() {
      if (pendingPlay) {
        pendingPause = true;
      } else {
        audio.pause();
      }
    },
  };
}
