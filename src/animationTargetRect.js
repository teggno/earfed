import { writable } from "svelte/store";

export const rect = writable({ top: 0, left: 0, width: 0, height: 0 });
