// This file makes the player globally accessible with a parameterized episode
// type.

import playerFactory from "./playerFactory";
import type RssEpisode from "../domain/RssEpisode";
import type AppleEpisode from "../domain/AppleEpisode";

const audio = new Audio();
const player = playerFactory<AppleEpisode | RssEpisode>(audio);

export default player;
