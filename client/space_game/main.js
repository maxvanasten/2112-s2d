import { generate_planet } from "./game_objects/planet.js";
import player from "./game_objects/player.js";
import ui_manager from "./game_objects/ui_manager.js";

const planets = [];
for (let i = 0; i < 10; i++) {
    planets.push(generate_planet());
}

const Game = {
    internal_objects: ["input_manager"],

    objects: [ui_manager, player, ...planets],
};

export default Game;
