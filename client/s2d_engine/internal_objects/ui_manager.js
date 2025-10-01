import { GameObject } from "../utils/game_object.js";

const ui_manager = new GameObject("INTERNAL_ui_manager");

ui_manager.flags.ALWAYS_UPDATE = true;
ui_manager.flags.ALWAYS_RENDER = true;

ui_manager.init = (core, self) => {
    self.colors = {};
    self.colors.text = "white";
}

ui_manager.getElement = (identifier) => {
    const element = document.getElementById(identifier);

    if (element) return element;
    return false;
}

ui_manager.setInnerHTML = (self, identifier, content) => {
    const element = self.getElement(identifier);
    if (!element) return false;

    if (element["innerHTML"]) element.innerHTML = content;
}

ui_manager.toggleVisibility = (self, identifier) => {
    const element = self.getElement(identifier);

    if (!element.style) return false;

    if (element.style.visibility == "visible") {
        element.style.visibility = "hidden";
    } else {
        element.style.visibility = "visible";
    }
}

export default ui_manager;