import { Vector2D } from "../../s2d_engine/utils/vectors.js";

export default {
    identifier: "player",
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER", "IS_PLAYER"],
    sprite: {
        image_path: "space_game/assets/textures/big_ship_0.png",
        source_width: 180,
        source_height: 169,
        render_width: 100,
        render_height: 90,
    },
    render_layer: 1,
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
        self.movement_vector = Vector2D.ZERO();
        self.acceleration = Vector2D.ZERO();
        self.velocity = Vector2D.ZERO();
        self.speed = 10;
        self.rotation = 0;
        self.turn_speed = 0.03;

        // Start player ui
        const ui = core._get_object_by_identifier("ui_manager");
        const player_location_element = [];

        // Background
        const bg_component = ui.generate_rectangle(
            innerWidth / 16,
            innerHeight / 16,
            innerWidth / 4,
            innerHeight / 16,
            "white"
        );
        // Text
        const text_component = ui.generate_text(
            "x=0, y=0, fps=0",
            innerWidth / 64,
            {
                x: innerWidth / 16 + innerWidth / 4 / 2,
                y: innerHeight / 16 + innerHeight / 16 / 2 + innerHeight / 64,
            },
            "center",
            "black"
        );
        text_component.update = (core, self, delta) => {
            const player = core._get_object_by_identifier("player");
            self.text = `x=${Math.floor(
                player.global_position.x
            )}, y=${Math.floor(player.global_position.y)}, fps=${Math.floor(
                core._average_frames_per_second
            )}`;
        };

        player_location_element.push(bg_component);
        player_location_element.push(text_component);

        ui.add_element(ui, player_location_element);
    },
    // render: (core, self, context, position) => {
    //     context.drawImage(self.sprite.image, self.sprite.source_width, self.sprite.source_height, self.sprite.render_width, self.sprite.render_height, position.x, position.y, self.sprite.render_width, self.sprite.render_height);
    // }
    update: (core, self, delta) => {
        // Cap rotation values between min and max of -2PI and 2PI
        if (self.rotation > Math.PI * 2)
            self.rotation = self.rotation - Math.PI * 2;
        if (self.rotation < -Math.PI * 2)
            self.rotation = self.rotation + Math.PI * 2;
        // Add acceleration to velocity
        self.velocity = self.velocity.add(self.acceleration);
        // Reset acceleration to 0
        self.acceleration = self.acceleration.scale(0);
        // Add velocity to position
        self.global_position = self.global_position.add(
            self.velocity.scale(delta)
        );
        // Reduce velocity each frame
        self.velocity = self.velocity.scale(0.995);

        // Add position/rotation to UI
    },

    actions: [
        {
            type: "keyboard",
            key: "w",
            while_key_down: (core, self) => {
                const direction = Vector2D.from_angle(self.rotation);
                self.acceleration = self.acceleration.add(
                    direction.scale(self.speed)
                );
            },
        },
        {
            type: "keyboard",
            key: "d",
            while_key_down: (core, self) => {
                self.rotation += self.turn_speed;
            },
        },
        {
            type: "keyboard",
            key: "s",
            while_key_down: (core, self) => {
                const direction = Vector2D.from_angle(self.rotation);
                self.acceleration = self.acceleration.add(
                    direction.scale(-self.speed * 0.25)
                );
            },
        },
        {
            type: "keyboard",
            key: "a",
            while_key_down: (core, self) => {
                self.rotation -= self.turn_speed;
            },
        },
    ],
};
