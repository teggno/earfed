import audioWrapperFactory from "./audioWrapperFactory";
import audioStoreFactory from "./audioStoreFactory";
import { derived, writable } from "svelte/store";

type HasEpisodeState<T> = {
  state: "hasEpisode";
  episode: T;
  currentSecond: number;
  durationSeconds: number;
  playing: boolean;
  ended: boolean;
};

type HasNoEpisodeState = {
  state: "noEpisode";
};

export default function playerFactory<
  T extends {
    episodeUrl: string;
  }
>(audio: HTMLAudioElement) {
  const audioWrapper = audioWrapperFactory(audio);
  const audioStore = audioStoreFactory(audio);

  const episodeStore = writable(undefined as T | undefined);
  const playerStore = derived(
    [audioStore, episodeStore],
    ([a, episode], set) => {
      if ((a?.src ?? "") !== (episode?.episodeUrl ?? "")) return;

      const newState = episode
        ? ({
            state: "hasEpisode",
            currentSecond: a.currentTime,
            durationSeconds: Number.isFinite(a.duration)
              ? Math.round(a.duration)
              : undefined,
            playing: !a.paused,
            ended: a.ended,
            episode,
          } as HasEpisodeState<T>)
        : ({ state: "noEpisode" } as HasNoEpisodeState);
      set(newState);
    },
    { state: "noEpisode" } as HasNoEpisodeState | HasEpisodeState<T>
  );
  let episodePlayedInAudio: T | undefined;

  return {
    playerStore,

    setEpisode(episode: T) {
      episodePlayedInAudio = episode;
      audioWrapper.setEpisodeUrl(episode.episodeUrl);

      episodeStore.set(episode);
    },

    play() {
      if (!episodePlayedInAudio) {
        console.warn("No episode to seek");
        return;
      }

      audioWrapper.play();
    },

    seek(second: number) {
      if (!episodePlayedInAudio) {
        console.warn("No episode to seek");
        return;
      }

      audioWrapper.seek(second);
    },

    seekBackward() {
      if (!episodePlayedInAudio) {
        console.warn("No episode to seek");
        return;
      }

      audioWrapper.seekBackward();
    },

    seekForward() {
      if (!episodePlayedInAudio) {
        console.warn("No episode to seek");
        return;
      }

      audioWrapper.seekForward();
    },

    pause() {
      if (!episodePlayedInAudio) {
        console.warn("No episode to pause");
        return;
      }

      audioWrapper.pause();
    },

    discardEpisode() {
      if (!episodePlayedInAudio) {
        console.warn("No episode to discard");
        return;
      }

      episodePlayedInAudio = undefined;
      audioWrapper.setEpisodeUrl();

      episodeStore.set(undefined);
    },
  };
}
