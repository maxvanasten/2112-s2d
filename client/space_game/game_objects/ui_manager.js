export default {
    identifier: "ui_manager",
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER", "IS_UI"],
    render_layer: 1000,
    init: (core, self) => {
        self.elements = {};
        self.maximum_elements = 10;

        // Load font
        const font = new FontFace(
            "game_font",
            "url(space_game/assets/fonts/8bit2.ttf)"
        );
        font.load().then((font) => {
            document.fonts.add(font);
            console.log(`Font loaded`);
        });

        self.font_family = "game_font";
        self.font_sizes = {
            header: innerWidth / 16,
            normal: innerWidth / 64,
        };
        self.colors = {
            text: "rgba(254,159,40,1)",
            body: "rgba(35,22,8,1)",
            border: "rgba(35,22,8,0.8)",
        };
    },
    // Add element to UI manager
    add_element: (self, element, identifier) => {
        // if (self.elements.length < self.maximum_elements) {
        //     self.elements.push(element);
        // } else {
        //     self.elements.shift();
        //     self.elements.push(element);
        // }

        self.elements[identifier] = element;
    },
    // Update elements based on update func
    update: (core, self, delta) => {
        Object.keys(self.elements).forEach((element_identifier, index) => {
            const element = self.elements[element_identifier];
            element.forEach((component) => {
                if (component.update) {
                    component.update(core, component, delta);
                }
            });
        });
    },
    update_text: (self, identifier, new_text) => {
        Object.keys(self.elements).forEach((element_identifier, index) => {
            if (element_identifier == identifier) {
                const element = self.elements[element_identifier];
                element.forEach((component) => {
                    if (component.text) {
                        component.text = new_text
                        component.last_changed = Date.now();
                    }
                })
            }
        })
    },
    // Render elements based on type
    render: (core, self, context, position) => {
        Object.keys(self.elements).forEach((element_identifier, index) => {
            const element = self.elements[element_identifier];
            element.forEach((component) => {
                switch (component.type) {
                    case "text":
                        context.font = `${component.font_size}px ${self.font_family}`;
                        context.textAlign = component.align;
                        context.fillStyle = component.fill_color;
                        component.text.forEach((line, index) => {
                            context.fillText(
                                line,
                                component.position.x,
                                component.position.y +
                                    index * component.font_size
                            );
                        });
                        if (component.stroke) {
                            context.strokeStyle = component.stroke_color;
                            context.lineWidth = component.stroke_weight;
                            context.strokeText(
                                component.text,
                                component.position.x,
                                component.position.y
                            );
                        }
                        break;
                    case "rectangle":
                        context.fillStyle = component.fill_color;
                        context.fillRect(
                            component.x,
                            component.y,
                            component.width,
                            component.height
                        );

                        if (component.stroke) {
                            context.strokeStyle = component.stroke_color;
                            context.lineWidth = component.stroke_weight;
                            context.strokeRect(
                                component.x,
                                component.y,
                                component.width,
                                component.height
                            );
                        }
                        break;
                }
            });
        });
    },
    // Generative functions for creating ui_manager-compatible ui components
    generate_text: (
        text,
        font_size,
        position,
        align,
        fill_color,
        stroke,
        stroke_color,
        stroke_weight
    ) => {
        return {
            type: "text",
            text: text || "NO TEXT",
            font_size: font_size || 12,
            position: position || { x: 0, y: 0 },
            align: align || "left",
            fill_color: fill_color || "black",
            stroke: stroke || false,
            stroke_color: stroke_color || "white",
            stroke_weight: stroke_weight || 0,
        };
    },

    generate_rectangle: (
        x,
        y,
        width,
        height,
        fill_color,
        stroke,
        stroke_color,
        stroke_weight
    ) => {
        return {
            type: "rectangle",
            x: x || 0,
            y: y || 0,
            width: width || 100,
            height: height || 100,
            fill_color: fill_color || "black",
            stroke: stroke || false,
            stroke_color: stroke_color || "white",
            stroke_weight: stroke_weight || 0,
        };
    },
};
