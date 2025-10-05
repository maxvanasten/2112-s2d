// TODO: Add planet functionality UI

import background from "./game_objects/background.js";
import item_manager from "./game_objects/item_manager.js";
import planet_manager from "./game_objects/planet_manager.js";
import player from "./game_objects/player.js";

const Game = {
    internal_objects: ["input_manager", "ui_manager"],

    objects: [
        planet_manager,
        item_manager,
        player,
        background,
    ],
};

export default Game;
