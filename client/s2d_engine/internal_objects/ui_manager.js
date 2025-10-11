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

ui_manager.setVisibility = (self, identifier, visibility) => {
    const element = self.getElement(identifier);

    if (!element.style) return false;

    element.style.visibility = visibility;
}

ui_manager._get_visibility = (self, identifier) => {
    const element = self.getElement(identifier);
    if (!element.style) return false;
    return element.style.visibility || false;
}

ui_manager._get_elements = (class_name) => {
    const elements = document.getElementsByClassName(class_name);
    console.log(`_get_elements: `)
    console.log(elements);
    return elements;
}

ui_manager._get_number_from = (id) => {
    return Number(document.getElementById(id).innerHTML);
}

export default ui_manager;