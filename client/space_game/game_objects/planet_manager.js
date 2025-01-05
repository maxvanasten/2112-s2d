import { Vector2D } from "../../s2d_engine/utils/vectors.js";

export default {
    identifier: "planet_manager",
    flags: ["ALWAYS_UPDATE"],
    options: {
        planet_amount: 1000,
        planet_min_size: 200,
        planet_max_size: 500,
        min_position: Vector2D.from_x_and_y(0, 0),
        max_position: Vector2D.from_x_and_y(100000, 100000),
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
        self.planet_names = [
            "Auron",
            "Caldera",
            "Meridia",
            "Solara",
            "Borealis",
            "Vespera",
            "Erythra",
            "Lythos",
            "Cendara",
            "Orona",
            "Selvara",
            "Halcyon",
            "Zephyra",
            "Altara",
            "Elara",
            "Marineris",
            "Dione",
            "Thalassa",
            "Pyralis",
            "Meliora",
            "Castora",
            "Avandra",
            "Serona",
            "Lyonesse",
            "Peridia",
            "Tethys",
            "Arcturus",
            "Vesperis",
            "Amara",
            "Solis",
        ];
        let raw_planet_objects = [];
        for (let i = 0; i < self.options.planet_amount; i++) {
            const name = `${
                self.planet_names[
                    Math.floor(Math.random() * self.planet_names.length)
                ]
            }-${Math.floor(Math.random() * 1000)}`;
            raw_planet_objects.push(self.generate_planet(self, i, name));
        }
        core._import_objects(raw_planet_objects);
    },
    generate_planet: (self, index, name) => {
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
            name: name || "???",
            sprite: {
                image_path: `space_game/assets/textures/${texture_name}.png`,
                source_width: 200,
                source_height: 200,
                render_width: size,
                render_height: size,
            },
            size: size / 2,
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

                // Check if player can interact
                const player = core._get_object_by_identifier("player");

                if (
                    player.global_position.distance(self.global_position) <
                    self.size
                ) {
                    self.in_range = true;
                } else {
                    self.in_range = false;
                }
            },
            render: (core, self, context, position) => {
                // Draw circle around interactable planet
                if (!self.in_range) return;

                const screen_position = core._global_to_screen(
                    self.global_position
                );

                context.beginPath();
                context.arc(
                    screen_position.x,
                    screen_position.y,
                    self.size,
                    0,
                    2 * Math.PI
                );
                context.strokeStyle =
                    core._get_object_by_identifier("ui_manager").colors.text;
                context.lineWidth = 3;
                context.stroke();

                // Draw interact text
                const ui = core._get_object_by_identifier("ui_manager");
                ui.update_text(
                    ui,
                    "tooltip",
                    [`Press <space> to interact with ${self.name}`],
                    100
                );
            },
        };
    },
};
