import { Vector2D } from "../s2d_engine/utils/vectors.js";
import player from "./game_objects/player.js";
import ui_manager from "./game_objects/ui_manager.js";

const Game = {
    internal_objects: ["input_manager"],

    objects: [
        ui_manager,
        player,
        {
            identifier: "planet_manager",
            flags: ["ALWAYS_UPDATE"],
            options: {
                planet_amount: 30000,
                planet_min_size: 200,
                planet_max_size: 500,
                min_position: Vector2D.from_x_and_y(0, 0),
                max_position: Vector2D.from_x_and_y(50000, 50000),
                min_rotation_speed: -0.1,
                max_rotation_speed: 0.1,
                textures: [
                    "red_planet",
                    "cheese_planet",
                    "pink_planet",
                    "blue_planet",
                    "brown_planet",
                    "purple_planet",
                ],
            },
            init: (core, self) => {
                let raw_planet_objects = [];
                for (let i = 0; i < self.options.planet_amount; i++) {
                    raw_planet_objects.push(self.generate_planet(self, i));
                }
                core._import_objects(raw_planet_objects);
            },
            generate_planet: (self, index) => {
                const size =
                    self.options.planet_min_size +
                    Math.floor(
                        Math.random() *
                            (self.options.planet_max_size -
                                self.options.planet_min_size)
                    );

                const texture_name =
                    self.options.textures[
                        Math.floor(Math.random() * self.options.textures.length)
                    ];

                return {
                    identifier: "planet_" + index,
                    sprite: {
                        image_path: `space_game/assets/textures/${texture_name}.png`,
                        source_width: 200,
                        source_height: 200,
                        render_width: size,
                        render_height: size,
                    },
                    render_layer: 0,
                    global_position: {
                        x:
                            self.options.min_position.x +
                            Math.floor(
                                Math.random() *
                                    (self.options.max_position.x -
                                        self.options.min_position.x)
                            ),
                        y:
                            self.options.min_position.y +
                            Math.floor(
                                Math.random() *
                                    (self.options.max_position.y -
                                        self.options.min_position.y)
                            ),
                    },
                    bounding_box: {
                        x: 0,
                        y: 0,
                        width: size,
                        height: size,
                    },
                    init: (core, planet) => {
                        planet.rotation = 0;
                        planet.rotation_speed =
                            self.options.min_rotation_speed +
                            Math.random() *
                                (self.options.max_rotation_speed -
                                    self.options.min_rotation_speed);
                    },
                    update: (core, self, delta) => {
                        self.rotation += self.rotation_speed * delta;
                    },
                };
            },
        },

export default Game;
