import { writable } from "svelte/store";

const seekBackwardSeconds = 20;
const seekForwardSeconds = 20;
const playing = "playing";
const paused = "paused";
const noEpisode = "noEpisode";
const initialValue = {
  episode: undefined,
  status: noEpisode,
  currentSecond: 0,
  durationSeconds: undefined,
};

const store = writable({ ...initialValue });
const playerInfo = { subscribe: store.subscribe };

let audioWithEpisode;

function play(episode) {
  if (episode && !audioWithEpisode) {
    audioWithEpisode = audioWithEpisodeFactory(episode);
  } else if (episode && audioWithEpisode) {
    if (!audioWithEpisode.isEpisode(episode)) {
      audioWithEpisode.destroy();
      audioWithEpisode = audioWithEpisodeFactory(episode);
    }
  } else if (!episode && !audioWithEpisode) {
    console.warn("No episode to play");
    return;
  }
  audioWithEpisode.play();
}

function seek(second) {
  if (!audioWithEpisode) {
    console.warn("No episode to seek");
    return;
  }

  audioWithEpisode.seek(second);
}

function seekBackward() {
  if (!audioWithEpisode) {
    console.warn("No episode to seek");
    return;
  }

  audioWithEpisode.seekBackward();
}

function seekForward() {
  if (!audioWithEpisode) {
    console.warn("No episode to seek");
    return;
  }

  audioWithEpisode.seekForward();
}

function pause() {
  if (!audioWithEpisode) {
    console.warn("No episode to pause");
    return;
  }

  audioWithEpisode.pause();
}

function removeEpisode() {
  if (!audioWithEpisode) {
    console.warn("No episode to remove");
    return;
  }
  audioWithEpisode.destroy();
  audioWithEpisode = null;
}

export {
  play,
  seekBackward,
  seekForward,
  pause,
  removeEpisode,
  playerInfo,
  playing,
  paused,
  noEpisode,
  seekBackwardSeconds,
  seekForwardSeconds,
};

let audio;

function audioWithEpisodeFactory(episode) {
  if (!audio) audio = document.querySelector("audio");

  audio.src = episode.episodeUrl;

  addEventListeners(audio);

  store.set({ ...initialValue, episode, status: paused });

  function addEventListeners() {
    audio.addEventListener("play", handleAudioPlay);
    audio.addEventListener("playing", handleAudioPlaying);
    audio.addEventListener("pause", handleAudioPause);
    audio.addEventListener("timeupdate", handleAudioTimeUpdate);
  }

  function removeEventListeners() {
    audio.removeEventListener("play", handleAudioPlay);
    audio.removeEventListener("playing", handleAudioPlaying);
    audio.removeEventListener("pause", handleAudioPause);
    audio.removeEventListener("timeupdate", handleAudioTimeUpdate);
  }

  function handleAudioPlay() {
    store.update((old) => ({
      ...old,
      status: playing,
      durationSeconds: Number.isFinite(audio.duration)
        ? Math.round(audio.duration)
        : undefined,
    }));
  }

  function handleAudioPlaying() {
    store.update((old) => ({
      ...old,
      durationSeconds: Number.isFinite(audio.duration)
        ? Math.round(audio.duration)
        : undefined,
    }));
  }

  function handleAudioPause() {
    store.update((old) => ({ ...old, status: paused }));
  }

  let lastSecond = 0;
  function handleAudioTimeUpdate() {
    const currentSecond = Math.round(audio.currentTime);
    if (lastSecond !== currentSecond) {
      store.update((old) => ({ ...old, currentSecond }));
    }
    lastSecond = currentSecond;
  }

  return {
    play() {
      audio.play();
    },
    seek(second) {
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
      audio.pause();
    },
    isEpisode(otherEpisode) {
      return otherEpisode && otherEpisode.episodeUrl === episode.episodeUrl;
    },
    destroy() {
      removeEventListeners();
      store.set({ ...initialValue });
      audio.pause();
      audio.src = ""; // seems to work as oposed to undefined
      audio.load();
    },
  };
}
