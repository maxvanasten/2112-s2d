import { Vector2D } from "../../s2d_engine/utils/vectors.js";

export default {
    identifier: "background",
    flags: ["ALWAYS_RENDER", "ALWAYS_UPDATE"],
    render_layer: -1000,
    texture_size: 1000,
    loaded: false,
    generated: false,
    textures: [],
    tiles: [],
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
                core._get_object_by_identifier("background").textures.push(img);
                loaded_textures++;

                if (loaded_textures === background_texture_names.length) {
                    self.loaded = true;

                    // Generate tiles
                    const tiles = [];
                    const max_pos =
                        core._get_object_by_identifier("planet_manager").options
                            .max_position;
                    const tiles_x = max_pos.y / self.texture_size;
                    const tiles_y = max_pos.y / self.texture_size;
                    for (let x = 0; x < tiles_x; x++) {
                        for (let y = 0; y < tiles_y; y++) {
                            tiles.push({
                                x: x * self.texture_size,
                                y: y * self.texture_size,
                                texture:
                                    self.textures[
                                        Math.floor(
                                            Math.random() * self.textures.length
                                        )
                                    ],
                            });
                        }
                    }
                    core._get_object_by_identifier("background").tiles = tiles;
                }
            };
        });
    },
    render: (core, self, context) => {
        let renders = 0;
        self.tiles.forEach((tile) => {
            const screen_pos = core._global_to_screen(
                Vector2D.from_x_and_y(tile.x, tile.y)
            );
            if (
                screen_pos.x + self.texture_size >= 0 &&
                screen_pos.x <= innerWidth
            ) {
                if (
                    screen_pos.y + self.texture_size >= 0 &&
                    screen_pos.y <= innerHeight
                ) {
                    context.drawImage(
                        tile.texture,
                        screen_pos.x,
                        screen_pos.y,
                        self.texture_size,
                        self.texture_size
                    );
                    renders++;
                }
            }
        });
    },
};
