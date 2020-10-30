import { writable } from "svelte/store";

const playing = "playing";
const paused = "paused";
const noEpisode = "noEpisode";
const initialValue = {
  episode: undefined,
  status: noEpisode,
};

const store = writable({ ...initialValue });

function play(episode) {
  store.update((old) => ({
    episode: episode || old.episode,
    status: playing,
  }));
}

function pause() {
  store.update((old) => ({ ...old, status: paused }));
}

function removeEpisode() {
  store.set({ ...initialValue });
}

const playerInfo = { subscribe: store.subscribe };

export { play, pause, removeEpisode, playerInfo, playing, paused, noEpisode };
