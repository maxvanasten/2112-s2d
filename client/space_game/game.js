import background from "./game_objects/background.js";
import planet_manager from "./game_objects/planet_manager.js";
import player from "./game_objects/player.js";
import ui_manager from "./game_objects/ui_manager.js";

const Game = {
    internal_objects: ["input_manager"],

    objects: [ui_manager, planet_manager, player, background],
};

export default Game;
