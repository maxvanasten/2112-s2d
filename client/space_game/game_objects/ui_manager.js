export default {
    identifier: "ui_manager",
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER"],
    init: (core, self) => {
        self.colors = {};
        self.colors.text = "white";
    },
    update: (core, self, delta) => {

    },
    render: (core, self, context) => {

    },
    getElement: (identifier) => {
        const element = document.getElementById(identifier);

        if (element) return element;
        return false;
    },
    setInnerHTML: (self, identifier, content) => {
        const element = self.getElement(identifier);
        if (!element) return false;

        if (element["innerHTML"]) element.innerHTML = content;
    },
    toggleVisibility: (self, identifier) => {
        const element = self.getElement(identifier);

        if (!element.style) return false;

        if (element.style.visibility == "visible") {
            element.style.visibility = "hidden";
        } else {
            element.style.visibility = "visible";
        }
    }
}