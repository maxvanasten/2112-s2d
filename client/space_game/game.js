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
        {
            identifier: "background",
            flags: ["ALWAYS_RENDER", "ALWAYS_UPDATE"],
            render_layer: -1000,
            textures: [],
            texture_size: 1000,
            loaded: false,
            generated: false,
            init: (core, self) => {
                // Load all background textures
                const background_texture_names = [
                    "backdrop0",
                    "backdrop1",
                    "backdrop2",
                    "backdrop3",
                    "backdrop4",
                    "backdrop5",
                    "backdrop6",
                ];
                let loaded_textures = 0;
                background_texture_names.forEach((texture_name) => {
                    const img = new Image();
                    img.src = `space_game/assets/textures/${texture_name}.png`;
                    img.onload = () => {
                        console.log(`img = ${img}, self.textures = `);
                        console.dir(self.textures);
                        self.textures.push[img];
                        loaded_textures++;

                        if (
                            loaded_textures === background_texture_names.length
                        ) {
                            console.log("Background textures loaded");
                            self.loaded = true;
                        }
                    };
                });
            },
            draw_bg: (core, self, context, x, y) => {
                const random_texture_index = Math.floor(
                    Math.random() * self.textures.length
                );
                const tile = {
                    texture: self.textures[random_texture_index],
                    position: Vector2D.from_x_and_y(
                        x * self.texture_size,
                        y * self.texture_size
                    ),
                };
                console.log(
                    `texture: ${tile.texture}(${random_texture_index}/${self.textures.length}), position: ${tile.position.x}, ${tile.position.y}`
                );
                console.dir(tile);
                self.tilemap.push(tile);
            },
            render: (core, self, context) => {
                if (!self.loaded) return;
                if (!self.generated) {
                    // Generate tilemap
                    const max_position =
                        core._get_object_by_identifier("planet_manager").options
                            .max_position;
                    self.tilemap = [];
                    self.tilemap_width = max_position.x / self.texture_size;
                    self.tilemap_height = max_position.y / self.texture_size;
                    for (let x = 0; x < self.tilemap_width; x++) {
                        for (let y = 0; y < self.tilemap_height; y++) {
                            self.draw_bg(core, self, context, x, y);
                        }
                    }
                }

                const player = core._get_object_by_identifier("player");
                const player_position = player.global_position;

                const tiles = [];

                // Get tile player is on
                const tile_x = Math.floor(
                    player_position.x / self.texture_size
                );
                const tile_y = Math.floor(
                    player_position.y / self.texture_size
                );
                const tile_index = tile_y * self.tilemap_width + tile_x;
                tiles.push(self.tilemap[tile_index]);

                // Get tiles around player
                const tile_radius = 5;
                for (
                    let x = tile_x - tile_radius;
                    x < tile_x + tile_radius;
                    x++
                ) {
                    for (
                        let y = tile_y - tile_radius;
                        y < tile_y + tile_radius;
                        y++
                    ) {
                        if (
                            x >= 0 &&
                            x < self.tilemap_width &&
                            y >= 0 &&
                            y < self.tilemap_height
                        ) {
                            const tile_index = y * self.tilemap_width + x;
                            tiles.push(self.tilemap[tile_index]);
                        }
                    }
                }

                tiles.forEach((tile) => {
                    console.dir(tile);
                    context.drawImage(
                        tile.texture,
                        tile.position.x,
                        tile.position.y
                    );
                });
            },
        },
    ],
};

export default Game;
