export default {
    identifier: "ui_manager",
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER", "IS_UI"],
    render_layer: 1000,
    init: (core, self) => {
        self.elements = [];
        self.maximum_elements = 10;
    },
    // Add element to UI manager
    add_element: (self, element) => {
        if (self.elements.length < self.maximum_elements) {
            self.elements.push(element);
        } else {
            self.elements.shift();
            self.elements.push(element);
        }
    },
    // Update elements based on update func
    update: (core, self, delta) => {
        self.elements.forEach((element, index) => {
            element.forEach((component) => {
                if (component.update) {
                    component.update(core, component, delta);
                }
            });
        });
    },
    // Render elements based on type
    render: (core, self, context, position) => {
        self.elements.forEach((element, index) => {
            element.forEach((component) => {
                switch (component.type) {
                    case "text":
                        context.font = `${component.font_size}px Arial`;
                        context.textAlign = component.align;
                        context.fillStyle = component.fill_color;

                        context.fillText(
                            component.text,
                            component.position.x,
                            component.position.y
                        );

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
