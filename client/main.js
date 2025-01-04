import { Core } from "./s2d_engine/core.js";
import Game from "./space_game/game.js";

const core = new Core();

core._import_game(Game);
core._connect_canvas("game_canvas", true);
core._start_game();
