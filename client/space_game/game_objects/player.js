import { Vector2D } from "../../s2d_engine/utils/vectors.js";

export default {
    identifier: "player",
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER", "IS_PLAYER"],
    sprite: {
        image_path: "space_game/assets/textures/big_ship_0.png",
        source_width: 180,
        source_height: 169,
        render_width: 40,
        render_height: 30,
    },
    render_layer: 3,
    global_position: {
        x: 100,
        y: 100,
    },
    bounding_box: {
        x: 0,
        y: 0,
        width: 40,
        height: 30,
    },
    scale: 1.5,
    planet: false,
    init: (core, self) => {
        self.sprite.render_width = self.sprite.render_width * self.scale;
        self.sprite.render_height = self.sprite.render_height * self.scale;
        self.bounding_box.width = self.bounding_box.width * self.scale;
        self.bounding_box.height = self.bounding_box.height * self.scale;

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

        // Update UI
        const ui = core._get_object_by_identifier("ui_manager");

        ui.setInnerHTML(ui, "dashboard_position", `Position: ${Math.round(self.global_position.x)}, ${Math.round(self.global_position.y)}`)
        ui.setInnerHTML(ui, "dashboard_fuel", `Fuel: ${self.current_ship.fuel.toFixed(2)}`);
        ui.setInnerHTML(ui, "dashboard_fps", `FPS: ${Math.floor(core._average_frames_per_second)}`);
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
            cooldown: true,
            key: " ",
            while_key_down: (core, self) => {
                const ui = core._get_object_by_identifier("ui_manager");

                ui.toggleVisibility(ui, "dashboard");
            },
        }
    ],
};
