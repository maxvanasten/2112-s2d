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

        // Spawn planet popup ui
        const ui = core._get_object_by_identifier("ui_manager");

        const popup_ui_w = innerWidth / 4;
        const popup_ui_h = innerHeight - innerHeight / 4;
        const popup_ui_x = innerWidth - popup_ui_w - innerWidth / 16;
        const popup_ui_y = innerHeight - popup_ui_h - innerHeight / 8;

        const popup_ui_body = ui.generate_rectangle(
            popup_ui_x,
            popup_ui_y,
            popup_ui_w,
            popup_ui_h,
            ui.colors.body,
            true,
            ui.colors.border,
            20
        );
        const popup_ui_planet_title = ui.generate_text(
            [`0_planet_name`],
            innerWidth / 48,
            {
                x: popup_ui_x + popup_ui_w / 2,
                y: popup_ui_y + popup_ui_h / 20,
            },
            "center",
            ui.colors.text
        );
        popup_ui_planet_title.update = (core, self, delta) => {
            const player = core._get_object_by_identifier("player");
            if (player.planet.name == self.text[0]) return;
            self.text[0] = player.planet.name;
        };

        const popup_ui = [popup_ui_body, popup_ui_planet_title];

        ui.add_element(ui, popup_ui, "popup_ui", false);
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

                // TODO: get popup element reference from ui manager
                const ui = core._get_object_by_identifier("ui_manager");
                const popup_ui = ui.get_element(ui, "popup_ui");
                if (
                    player.global_position.distance(self.global_position) <
                    self.size
                ) {
                    self.in_range = true;
                    player.planet = self;
                    // NOTE: set data on popup element
                    popup_ui.data = {
                        planet_name: self.name,
                        //TODO: Make dynamic planet descriptions that involve the utilities the planet has
                    };
                    popup_ui.visible = true;
                } else {
                    if (!self.in_range) return;
                    self.in_range = false;
                    // Unset
                    player.planet = false;
                    popup_ui.visible = false;
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
