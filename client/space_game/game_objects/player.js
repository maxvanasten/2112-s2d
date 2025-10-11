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
    wallet: {
        cash: 500,
        bank: 0
    },
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
            fuel: 1000,
            fuel_usage: 0.01,
            fuelUsageNow: 0,
            thrust: 0.0,
            thrustDelta: 0.005,
            storage: []
        };
        // self.last_switched_ships = 0;
        // self.last_docked_vessel = 0;

        // Give items for testing
        const item_manager = core._get_object_by_identifier("item_manager");
        item_manager.add_to_inventory(item_manager, self.current_ship.storage, "fuel", 500);

        const ui = core._get_object_by_identifier("ui_manager");
        ui.getElement("dashboard_toggle_button").onclick = () => {
            const ui = core._get_object_by_identifier("ui_manager");
            ui.toggleVisibility(ui, "dashboard_main");
        };

        const toggleFunc = () => {
            const ui = core._get_object_by_identifier("ui_manager");

            const inventory_visibility = ui._get_visibility(ui, "inventory");
            if (inventory_visibility == "hidden" || inventory_visibility == false) {
                // Update wallet text
                const wallet_text = `You are currently carrying ${self.wallet.cash.toFixed(2)} in cash. Your bank balance is: ${self.wallet.bank.toFixed(2)}`;
                ui.setInnerHTML(ui, "inventory_wallet_text", wallet_text);
                // Update inventory table
                let inventory_table = `<table
                class="table"
                id="inventory_table"
            >
                <thead>
                    <tr>
                        <th scope="col">
                            <center>Item Name</center>
                        </th>
                        <th scope="col">
                            <center>Useable</center>
                        </th>
                        <th scope="col">
                            <center>Tradeable</center>
                        </th>
                        <th scope="col">
                            <center>Quantity</center>
                        </th>
                    </tr>
                </thead>`;

                self.current_ship.storage.forEach((itemstack) => {
                    inventory_table += `<th scope="row"><center>${itemstack.name}</center></td>`;
                    if (itemstack.is_useable) {
                        inventory_table += `<td><center><button class="btn btn-primary m-2">Use</button></center></td>`;
                    } else {
                        inventory_table += `<td></td>`;
                    }
                    if (itemstack.is_tradeable) {
                        inventory_table += `<td><center>Yes</center></td>`;
                    } else {
                        inventory_table += `<td><center>No</center></td>`;
                    }
                    inventory_table += `<td><center>${itemstack.amount} ${itemstack.unit_short}</center></td></tr>`;
                })
                ui.setInnerHTML(ui, "inventory_table", inventory_table);
                ui.setVisibility(ui, "planet_name_div", "hidden");
                ui.setVisibility(ui, "planet_menu_div", "hidden");

            } else {
                // Turning it off
                if (self.planet) {
                    ui.setVisibility(ui, "planet_name_div", "visible");
                }
            }
            ui.toggleVisibility(ui, "inventory");
        }

        ui.getElement("inventory_toggle").onclick = toggleFunc;
        ui.getElement("inventory_exit_button").onclick = toggleFunc;

        const reset_planet_menu = () => {
            self.landed = true;
            self.current_ship.thrust = 0;
            const ui = core._get_object_by_identifier("ui_manager");
            ui.setVisibility(ui, "planet_name_div", "hidden");
            ui.setVisibility(ui, "planet_menu_div", "visible");

            ui.setInnerHTML(ui, "planet_menu_name", self.planet.name);
            ui.setInnerHTML(ui, "planet_menu_table", self.planet.get_resource_table(self.planet));
            ui.setInnerHTML(ui, "planet_cash", self.planet.cash.toFixed(2));

            for (let button of ui._get_elements("trade_button")) {
                button.onclick = () => {
                    const ui = core._get_object_by_identifier("ui_manager");
                    ui.setVisibility(ui, "input", "visible");
                    ui.setVisibility(ui, "planet_menu_div", "hidden");

                    let item = false;
                    self.planet.resources.forEach((resource) => {
                        if (resource.id == button.getAttribute("item_id")) {
                            item = resource;
                        }
                    })
                    if (!item) throw Error("Item is false/undefined");

                    // Check if player has this item
                    let owned_ship = 0;
                    self.current_ship.storage.forEach((itemstack) => {
                        if (itemstack.id == item.id) owned_ship = itemstack.amount;
                    })

                    let action = "";
                    if (button.getAttribute("trade") == "buy") action = "Buying";
                    if (button.getAttribute("trade") == "sell") action = "Selling";
                    if (action == "") throw Error("action is empty")

                    ui.setInnerHTML(ui, "input_header", `${action} ${item.name} @ ${item.buy_price}`);

                    ui.setInnerHTML(ui, "item_unit", item.unit_short);
                    ui.setInnerHTML(ui, "input_owned_ship", owned_ship);
                    ui.setInnerHTML(ui, "input_cash_ship", self.wallet.cash.toFixed(2));
                    ui.setInnerHTML(ui, "input_owned_planet", item.amount);
                    ui.setInnerHTML(ui, "input_cash_planet", self.planet.cash.toFixed(2));

                    // Initialize controls
                    const inputFunc = (delta, max) => {
                        const ui = core._get_object_by_identifier("ui_manager");
                        const amount = +ui.getElement("input_amount").innerHTML;

                        let can_afford = 0;
                        let can_supply = 0;
                        let price = 0;
                        if (action == "Buying") {
                            can_afford = Math.floor(self.wallet.cash / item.buy_price);
                            can_supply = item.amount;
                            price = item.buy_price;
                        }
                        if (action == "Selling") {
                            can_afford = Math.floor(self.planet.cash / item.sell_price);
                            can_supply = owned_ship;
                            price = item.sell_price;
                        }

                        let new_amount = amount + delta;
                        if (new_amount < 0) new_amount = 0;
                        if (new_amount > can_supply) new_amount = can_supply;
                        if (new_amount > can_afford) new_amount = can_afford;

                        ui.setInnerHTML(ui, "input_amount", new_amount);
                        ui.setInnerHTML(ui, "input_value", (new_amount * price).toFixed(2));
                    }

                    let max = 0;
                    if (action == "Buying") max = item.amount;
                    if (action == "Selling") max = owned_ship;

                    const input_buttons = ui._get_elements("input_button");
                    for (let input_button of input_buttons) {
                        input_button.onclick = () => {
                            inputFunc(+input_button.innerHTML, +ui.getElement("input_owned_planet").innerHTML);
                        }
                    }

                    ui.getElement("input_confirm").onclick = () => {
                        const amount = ui._get_number_from("input_amount");
                        const value = +ui._get_number_from("input_value");

                        const item_manager = core._get_object_by_identifier("item_manager");

                        if (action == "Buying") {
                            item_manager.add_to_inventory(item_manager, self.current_ship.storage, item.id, amount);
                            item_manager.take_from_inventory(item_manager, self.planet.resources, item.id, amount);
                            self.wallet.cash -= value;
                            self.planet.cash += value;
                        }
                        if (action == "Selling") {
                            item_manager.add_to_inventory(item_manager, self.planet.resources, item.id, amount);
                            item_manager.take_from_inventory(item_manager, self.current_ship.storage, item.id, amount);
                            self.wallet.cash += value;
                            self.planet.cash -= value
                        }

                        ui.setVisibility(ui, "input", "hidden");
                        ui.setInnerHTML(ui, "planet_menu_table", self.planet.get_resource_table(self.planet));
                        ui.setInnerHTML(ui, "planet_cash", self.planet.cash.toFixed(2));
                        ui.setVisibility(ui, "planet_menu_div", "visible");

                        // Reset input menu
                        ui.setInnerHTML(ui, "input_amount", 0);
                        ui.setInnerHTML(ui, "input_value", 0);
                        ui.setInnerHTML(ui, "input_owned_ship", 0);
                        ui.setInnerHTML(ui, "input_owned_planet", 0);
                        reset_planet_menu();
                    }

                    ui.getElement("input_cancel").onclick = () => {
                        ui.setVisibility(ui, "input", "hidden");
                        ui.setVisibility(ui, "planet_menu_div", "visible");
                        ui.setInnerHTML(ui, "input_amount", 0);
                        ui.setInnerHTML(ui, "input_value", 0);
                        ui.setInnerHTML(ui, "input_owned_ship", 0);
                        ui.setInnerHTML(ui, "input_owned_planet", 0);
                        reset_planet_menu();
                    }
                }
            }
        }

        ui.getElement("access_planet_button").onclick = reset_planet_menu;

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
