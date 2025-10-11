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
            const name = `${self.planet_names[
                Math.floor(Math.random() * self.planet_names.length)
            ]
                }-${Math.floor(Math.random() * 1000)}`;
            raw_planet_objects.push(self.generate_planet(core, self, i, name));
        }
        core._import_objects(raw_planet_objects);
    },
    generate_planet: (core, self, index, name) => {
        const item_manager = core._get_object_by_identifier("item_manager");

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
            resources: [],
            cash: 0,
            get_resource_string: (self) => {
                let str = "";

                self.resources.forEach((resource) => {
                    let buy_price = "Not buying";
                    let sell_price = "Not selling"
                    if (resource.buy_price) buy_price = resource.buy_price;
                    if (resource.sell_price) sell_price = resource.sell_price;

                    str += `${resource.name} (${resource.id}) <button class="btn btn-success">Buy</button> ${buy_price}${resource.unit}, <button class="btn btn-danger">Sell</button> ${sell_price}${resource.unit} [${resource.amount} ${resource.unit_name}]\n`



                })

                return str;
            },
            get_resource_table: (self) => {
                let str = `<thead>
                    <tr>
                        <th scope="col">
                            <center>Item Name</center>
                        </th>
                        <th scope="col">
                            <center>Buy</center>
                        </th>
                        <th scope="col">
                            <center>Sell</center>
                        </th>
                        <th scope="col">
                            <center>Storage</center>
                        </th>
                    </tr>
                </thead><tr>`;

                self.resources.forEach((resource) => {
                    str += `<th scope="row">${resource.name}</td>`;
                    str += `<td><button class="btn btn-primary m-2 trade_button" item_id="${resource.id}" trade="buy">${resource.buy_price}</button></td>`;
                    str += `<td><button class="btn btn-danger m-2 trade_button" item_id="${resource.id}" trade="sell">${resource.sell_price}</button></td>`;
                    str += `<td>${resource.amount} ${resource.unit_short}</td></tr>`;
                })

                return str;
            },
            init: (core, planet) => {
                planet.rotation = 0;
                planet.rotation_speed =
                    self.options.min_rotation_speed +
                    Math.random() *
                    (self.options.max_rotation_speed -
                        self.options.min_rotation_speed);
                planet.cash = (Math.random() * 10000);

                const types = ["fuel_planet", "mining_planet"];
                planet.type = types[Math.floor(Math.random() * types.length)];

                planet.resources = item_manager.generate_planet_resources(item_manager, planet.type)
            },
            update: (core, planet, delta) => {
                planet.rotation += planet.rotation_speed * delta;

                // TODO: Check if player can interact
                const player = core._get_object_by_identifier("player");
                const ui = core._get_object_by_identifier("ui_manager");

                // TODO: get popup element reference from ui manager
                if (
                    player.global_position.distance(planet.global_position) <
                    planet.size
                ) {
                    if (!planet.in_range) {

                        planet.in_range = true;
                        player.planet = planet;
                        if (ui._get_visibility(ui, "inventory") != "visible") {
                            ui.setVisibility(ui, "planet_name_div", "visible");
                        }
                        ui.setInnerHTML(ui, "planet_name", player.planet.name);

                        let type = "Unknown";

                        if (player.planet.type == "fuel_planet") type = "Fuel Planet";
                        if (player.planet.type == "mining_planet") type = "Mining Planet";
                        console.log(`PLANET_TYPE: ${type}`);
                        ui.setInnerHTML(ui, "planet_type", type);

                        // NOTE: set data on popup element
                        // TODO: Make dynamic planet descriptions that involve the utilities the planet has
                    }

                } else {
                    if (!planet.in_range) return;
                    planet.in_range = false;
                    // Unset
                    player.planet = false;
                }
            },
            render: (core, self, context, position) => {
                // Draw circle around interactable planet
                if (!self.in_range) return;

                // console.log("planet.in_range");

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
            },
        };
    },
};
