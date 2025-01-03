export const generate_planet = () => {
    const size = 100 + Math.floor(Math.random() * 600);
    const texture_names = [
        "red_planet",
        "cheese_planet",
        "pink_planet",
        "blue_planet",
        "brown_planet",
        "purple_planet",
    ];

    const texture_name =
        texture_names[Math.floor(Math.random() * texture_names.length)];

    return {
        identifier: "planet",
        sprite: {
            image_path: `space_game/assets/textures/${texture_name}.png`,
            source_width: 200,
            source_height: 200,
            render_width: size,
            render_height: size,
        },
        render_layer: 0,
        global_position: {
            x: Math.floor(Math.random() * 2000),
            y: Math.floor(Math.random() * 2000),
        },
        bounding_box: {
            x: 0,
            y: 0,
            width: 300,
            height: 300,
        },
        init: (core, self) => {
            self.rotation = 0;
            self.rotation_speed = Math.random() * 0.1;
        },
        update: (core, self, delta) => {
            self.rotation += self.rotation_speed * delta;
        },
    };
};
