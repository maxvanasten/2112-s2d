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
    landed: false,
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
        self.current_ship = {
            position: Vector2D.from_x_and_y(0, 0),
            acceleration: Vector2D.from_x_and_y(0, 0),
            velocity: Vector2D.from_x_and_y(0, 0),
            rotation: 0,
            rotation_vector: 0,
            angle: 0,
            speed: 10,
            base_turn_speed: 0.015,
            speed_decay: 0.98,
            reverse_speed_mult: 0.5,
            max_fuel: 1000,
            fuel: 0,
            fuel_usage: 0.01,
            fuelUsageNow: 0,
            thrust: 0.0,
            thrustDelta: 0.001,
        };
        self.current_ship.fuel = self.current_ship.max_fuel;
        // self.last_switched_ships = 0;
        // self.last_docked_vessel = 0;

        const ui = core._get_object_by_identifier("ui_manager");
        ui.getElement("dashboard_toggle_button").onclick = () => {
            const ui = core._get_object_by_identifier("ui_manager");
            ui.toggleVisibility(ui, "dashboard_main");
        };
        ui.getElement("access_planet_button").onclick = () => {
            self.landed = true;
            self.current_ship.thrust = 0;
            const ui = core._get_object_by_identifier("ui_manager");
            ui.setVisibility(ui, "planet_name_div", "hidden");
            ui.setVisibility(ui, "planet_menu_div", "visible");
            ui.setInnerHTML(ui, "planet_menu_name", self.planet.name);
            ui.setInnerHTML(ui, "planet_menu_table", self.planet.get_resource_table(self.planet));
        }
        ui.getElement("planet_menu_leave_button").onclick = () => {
            self.landed = false;
            const ui = core._get_object_by_identifier("ui_manager");
            ui.setVisibility(ui, "planet_name_div", "visible");
            ui.setVisibility(ui, "planet_menu_div", "hidden");
        }

        ui.getElement("controls_thrust_0").onclick = () => {
            self.current_ship.thrust = 0;
        }
        ui.getElement("controls_thrust_33").onclick = () => {
            self.current_ship.thrust = 0.33;
        }
        ui.getElement("controls_thrust_67").onclick = () => {
            self.current_ship.thrust = 0.67;
        }
        ui.getElement("controls_thrust_100").onclick = () => {
            self.current_ship.thrust = 1;
        }
        ui.getElement("controls_left").onpointerdown = () => {
            self.current_ship.rotation_vector = -self.current_ship.base_turn_speed;
        }

        ui.getElement("controls_left").onpointerup = () => {
            self.current_ship.rotation_vector = 0;
        }

        ui.getElement("controls_right").onpointerdown = () => {
            self.current_ship.rotation_vector = self.current_ship.base_turn_speed;
        }

        ui.getElement("controls_right").onpointerup = () => {
            self.current_ship.rotation_vector = 0;
        }

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

        // Add rotation vector
        self.current_ship.rotation += self.current_ship.rotation_vector;

        // MOVEMENT
        const speed = self.current_ship.speed * self.current_ship.thrust;
        if (!self.current_ship.fuel)
            speed = self.current_ship.speed * 0.2;
        if (self.current_ship.thrust) {
            self.current_ship.fuelUsageNow = (self.current_ship.fuel_usage * 0.1) + ((self.current_ship.fuel_usage * 0.9) * self.current_ship.thrust)
            self.current_ship.fuel -= self.current_ship.fuelUsageNow;
        } else {
            self.current_ship.fuelUsageNow = 0;
        }
        self.current_ship.direction = Vector2D.from_angle(
            self.current_ship.rotation
        );

        self.current_ship.acceleration =
            self.current_ship.acceleration.add(self.current_ship.direction.scale(speed));

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

        ui.setInnerHTML(ui, "debug_position", `Position: ${Math.round(self.global_position.x)}, ${Math.round(self.global_position.y)}`)
        ui.setInnerHTML(ui, "debug_fuel", `Fuel: ${self.current_ship.fuel.toFixed(2)} (${self.current_ship.fuelUsageNow.toFixed(6)})`);
        ui.setInnerHTML(ui, "debug_fps", `${Math.floor(core._average_frames_per_second)}`);
        ui.setInnerHTML(ui, "debug_thrust", `Thrust %: ${self.current_ship.thrust.toFixed(2)}`);

        ui.getElement("progress_thrust").value = self.current_ship.thrust;
        ui.setInnerHTML(ui, "dashboard_coordinates", `${Math.round(self.global_position.x)}:${Math.round(self.global_position.y)}`)
        ui.setInnerHTML(ui, "dashboard_thrust", `${self.current_ship.thrust.toFixed(2)}`);
        ui.getElement("progress_fuel").value = self.current_ship.fuel;
        ui.setInnerHTML(ui, "dashboard_fuel", `${self.current_ship.fuel.toFixed(0)} <span class="small">(-${self.current_ship.fuelUsageNow.toFixed(4)})</span>`)

        if (!self.planet) {
            ui.setVisibility(ui, "planet_name_div", "hidden");
            ui.setInnerHTML(ui, "planet_name", " ");
        }
    },

    actions: [
        {
            type: "keyboard",
            key: "w",
            while_key_down: (core, self) => {
                if (self.landed) return;
                // Increase thrust
                self.current_ship.thrust += self.current_ship.thrustDelta;
                // Constrain thrust between 0 and 1
                if (self.current_ship.thrust < 0) self.current_ship.thrust = 0;
                if (self.current_ship.thrust > 1) self.current_ship.thrust = 1;
            },
        },
        {
            type: "keyboard",
            key: "d",
            while_key_down: (core, self) => {
                if (self.landed) return;
                self.current_ship.rotation += self.current_ship.base_turn_speed;
            },
        },
        {
            type: "keyboard",
            key: "s",
            while_key_down: (core, self) => {
                if (self.landed) return;
                // Decrease thrust
                self.current_ship.thrust -= self.current_ship.thrustDelta * 2;
                // Constrain thrust between 0 and 1
                if (self.current_ship.thrust < 0) self.current_ship.thrust = 0;
                if (self.current_ship.thrust > 1) self.current_ship.thrust = 1;
            },
        },
        {
            type: "keyboard",
            key: "a",
            while_key_down: (core, self) => {
                if (self.landed) return;
                self.current_ship.rotation -= self.current_ship.base_turn_speed;
            },
        },
        {
            type: "keyboard",
            cooldown: true,
            key: " ",
            while_key_down: (core, self) => {
                const ui = core._get_object_by_identifier("ui_manager");

                ui.toggleVisibility(ui, "debug");
            },
        }
    ],
};
