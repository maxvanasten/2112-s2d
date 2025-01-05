import { Vector2D } from "../../s2d_engine/utils/vectors.js";

export default {
    identifier: "player",
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER", "IS_PLAYER"],
    sprite: {
        image_path: "space_game/assets/textures/big_ship_0.png",
        source_width: 180,
        source_height: 169,
        render_width: 80,
        render_height: 65,
    },
    render_layer: 3,
    global_position: {
        x: 100,
        y: 100,
    },
    bounding_box: {
        x: 0,
        y: 0,
        width: 100,
        height: 90,
    },
    init: (core, self) => {
        self.global_position.x =
            core._get_object_by_identifier("planet_manager").options
                .max_position.x / 2;
        self.global_position.y =
            core._get_object_by_identifier("planet_manager").options
                .max_position.y / 2;
        self.ships = {
            mothership: {
                position: Vector2D.from_x_and_y(0, 0),
                acceleration: Vector2D.from_x_and_y(0, 0),
                velocity: Vector2D.from_x_and_y(0, 0),
                rotation: 0,
                speed: 10,
                base_turn_speed: 0.015,
                speed_decay: 0.98,
                reverse_speed_mult: 0.5,
                max_fuel: 1000,
                fuel: 0,
                fuel_usage: 0.01,
            },
        };
        self.current_ship = self.ships.mothership;
        self.current_ship.fuel = self.current_ship.max_fuel;
        // self.last_switched_ships = 0;
        // self.last_docked_vessel = 0;

        const quest_manager = core._get_object_by_identifier("quest_manager");
        const quest = quest_manager.generate_quest();
        quest_manager.current_quest = quest;

        const ui = core._get_object_by_identifier("ui_manager");

        // Tooltip ui
        const tooltip_ui_w = innerWidth / 2;
        const tooltip_ui_h = innerHeight / 8;
        const tooltip_ui_x = innerWidth / 2 - tooltip_ui_w / 2;
        const tooltip_ui_y = innerHeight - tooltip_ui_h - innerHeight / 8;

        const tooltip_ui_background = ui.generate_rectangle(
            tooltip_ui_x,
            tooltip_ui_y,
            tooltip_ui_w,
            tooltip_ui_h,
            ui.colors.body,
            true,
            ui.colors.border,
            10
        );

        const tooltip_ui_text = ui.generate_text(
            [],
            innerWidth / 64,
            {
                x: tooltip_ui_x + tooltip_ui_w / 2,
                y: tooltip_ui_y + tooltip_ui_h / 2,
            },
            "center",
            ui.colors.text
        );
        tooltip_ui_text.display_time = 3500;
        tooltip_ui_text.last_changed = Date.now();
        tooltip_ui_text.update = (core, self, delta) => {
            if (Date.now() - self.last_changed >= self.display_time) {
                self.text = [];
            }
        };

        const tooltip_ui = [tooltip_ui_text];

        ui.add_element(ui, tooltip_ui, "tooltip");

        // Start player ui
        const player_location_element = [];

        const ui_x = 0;
        const ui_y = 0;
        const ui_width = innerWidth;
        const ui_height = innerHeight / 16;
        // Background
        const bg_component = ui.generate_rectangle(
            ui_x,
            ui_y,
            ui_width,
            ui_height,
            "white"
        );
        // Text
        const text_component = ui.generate_text(
            ["x=0, y=0, fps=0"],
            innerWidth / 64,
            {
                x: ui_x + ui_width / 2,
                y: ui_y + ui_height / 2 + innerHeight / 64,
            },
            "center",
            "black"
        );
        text_component.update = (core, self, delta) => {
            const player = core._get_object_by_identifier("player");
            self.text[0] = `x=${Math.floor(
                player.global_position.x
            )}, y=${Math.floor(player.global_position.y)}, fps=${Math.floor(
                core._average_frames_per_second
            )} Updates=${core._updated_objects_count}, Renders=${
                core._rendered_objects_count
            } Velocity=${player.current_ship.velocity
                .magnitude()
                .toFixed(2)} Planets=${
                core._get_object_by_identifier("planet_manager").options
                    .planet_amount
            }`;
        };

        player_location_element.push(bg_component);
        player_location_element.push(text_component);

        // NOTE: Toggle debug ui
        // ui.add_element(ui, player_location_element);

        // NOTE: DASHBOARD UI
        const dashboard_ui = [];

        const dashboard_ui_w = innerWidth / 4;
        const dashboard_ui_h = innerHeight / 8;
        const dashboard_ui_x = innerWidth / 64;
        const dashboard_ui_y = innerHeight - innerHeight / 64 - dashboard_ui_h;

        const dashboard_bg = ui.generate_rectangle(
            dashboard_ui_x,
            dashboard_ui_y,
            dashboard_ui_w,
            dashboard_ui_h,
            ui.colors.body,
            true,
            ui.colors.border,
            10
        );
        const dashboard_text = ui.generate_text(
            [`Location: `, `Fuel: `, `Velocity: `],
            ui.font_sizes.normal,
            {
                x: dashboard_ui_x + dashboard_ui_w / 2,
                y: dashboard_ui_y + dashboard_ui_h / 4,
            },
            "center",
            ui.colors.text
        );
        dashboard_text.update = (core, self, delta) => {
            const player = core._get_object_by_identifier("player");
            self.text[0] = `Location: ${Math.floor(
                player.global_position.x
            )}:${Math.floor(player.global_position.y)}`;
            self.text[1] = `Fuel: ${Math.floor(player.current_ship.fuel)}/${
                player.current_ship.max_fuel
            } L`;
            self.text[2] = `Velocity: ${Math.floor(
                player.current_ship.velocity.magnitude()
            )} U/s`;
        };

        dashboard_ui.push(dashboard_bg);
        dashboard_ui.push(dashboard_text);
        ui.add_element(ui, dashboard_ui);

        // NOTE: FPS Counter
        const fps_element = [];
        const fps_text = ui.generate_text(
            ["0"],
            ui.font_sizes.header,
            {
                x: innerWidth - innerWidth / 24,
                y: innerHeight - innerHeight / 32,
            },
            "center",
            "rgba(255, 100, 100, 0.5)"
        );
        fps_text.update = (core, self, delta) => {
            if (core._average_frames_per_second == Infinity) return;
            self.text[0] = Math.floor(core._average_frames_per_second);
        };

        fps_element.push(fps_text);
        ui.add_element(ui, fps_element);
    },
    update: (core, self, delta) => {
        // Cap rotation values between min and max of -2PI and 2PI
        if (self.current_ship.rotation > Math.PI * 2)
            self.current_ship.rotation =
                self.current_ship.rotation - Math.PI * 2;
        if (self.current_ship.rotation < -Math.PI * 2)
            self.current_ship.rotation =
                self.current_ship.rotation + Math.PI * 2;
        self.rotation = self.current_ship.rotation;
        // Add acceleration to velocity
        self.current_ship.velocity = self.current_ship.velocity.add(
            self.current_ship.acceleration
        );
        // Reset acceleration to 0
        self.current_ship.acceleration =
            self.current_ship.acceleration.scale(0);
        // Add velocity to position
        self.global_position = self.global_position.add(
            self.current_ship.velocity.scale(delta)
        );
        // Reduce velocity each frame
        self.current_ship.velocity = self.current_ship.velocity.scale(
            self.current_ship.speed_decay
        );

        // Constrain position to map size
        const map_max =
            core._get_object_by_identifier("planet_manager").options
                .max_position;
        if (self.global_position.x < 0) self.global_position.x = 0;
        if (self.global_position.y < 0) self.global_position.y = 0;
        if (self.global_position.x > map_max.x)
            self.global_position.x = map_max.x;
        if (self.global_position.y > map_max.y)
            self.global_position.y = map_max.y;
    },

    actions: [
        {
            type: "keyboard",
            key: "w",
            while_key_down: (core, self) => {
                // If fuel
                const speed = self.current_ship.speed;
                if (!self.current_ship.fuel)
                    speed = self.current_ship.speed * 0.2;
                self.current_ship.fuel -= self.current_ship.fuel_usage;
                const direction = Vector2D.from_angle(
                    self.current_ship.rotation
                );
                self.current_ship.acceleration =
                    self.current_ship.acceleration.add(direction.scale(speed));
            },
        },
        {
            type: "keyboard",
            key: "d",
            while_key_down: (core, self) => {
                self.current_ship.rotation += self.current_ship.base_turn_speed;
            },
        },
        {
            type: "keyboard",
            key: "s",
            while_key_down: (core, self) => {
                const direction = Vector2D.from_angle(
                    self.current_ship.rotation
                );
                self.current_ship.acceleration =
                    self.current_ship.acceleration.add(
                        direction.scale(
                            -self.current_ship.speed *
                                self.current_ship.reverse_speed_mult
                        )
                    );
            },
        },
        {
            type: "keyboard",
            key: "a",
            while_key_down: (core, self) => {
                self.current_ship.rotation -= self.current_ship.base_turn_speed;
            },
        },
        {
            type: "keyboard",
            key: " ",
            while_key_down: (core, self) => {
                // Interact with planet
            },
        },
        // {
        //     type: "keyboard",
        //     key: "e",
        //     while_key_down: (core, self) => {
        //         if (Date.now() - self.last_switched_ships < 1000) return;
        //         if (self.current_ship.velocity.magnitude() > 50) return;
        //         self.last_switched_ships = Date.now();
        //         if (
        //             self.current_ship ==
        //             core._get_object_by_identifier("mothership")
        //         ) {
        //             self.current_ship =
        //                 core._get_object_by_identifier("vessel");
        //             core._get_object_by_identifier("vessel").active = true;
        //             core._get_object_by_identifier("mothership").active = false;
        //         } else {
        //             self.current_ship =
        //                 core._get_object_by_identifier("mothership");
        //             core._get_object_by_identifier("vessel").active = false;
        //             core._get_object_by_identifier("mothership").active = true;
        //         }

        //         self.global_position = self.current_ship.global_position;
        //     },
        // },
        // // Dock vessel to mothership if close enough
        // {
        //     type: "keyboard",
        //     key: " ",
        //     while_key_down: (core, self) => {
        //         if (Date.now() - self.last_docked_vessel < 1000) return;
        //         if (self.current_ship.identifier == "mothership") return;
        //         if (
        //             self.current_ship.global_position.distance(
        //                 core._get_object_by_identifier("mothership")
        //             ) < 1000
        //         ) {
        //             self.current_ship =
        //                 core._get_object_by_identifier("mothership");
        //             core._get_object_by_identifier("vessel").active = false;
        //             core._get_object_by_identifier("vessel").docked = true;
        //             core._get_object_by_identifier("mothership").active = true;
        //         }
        //     },
        // },
    ],
};
