import background from "./game_objects/background.js";
import planet_manager from "./game_objects/planet_manager.js";
import player from "./game_objects/player.js";
import ui_manager from "./game_objects/ui_manager.js";

const Game = {
    internal_objects: ["input_manager"],

    objects: [
        ui_manager,
        {
            identifier: "quest_manager",
            flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER"],
            init: (core, self) => {
                self.current_quest = null;
                self.completed_quests = [];

                self.current_quest = {
                    name: "Example quest",
                    objective: "Return the x item to y planet in here",
                    giver: "Unknown",
                };

                // Setup UI
                const ui = core._get_object_by_identifier("ui_manager");
                const quest_ui_w = innerWidth / 4;
                const quest_ui_h = innerHeight / 4;
                const quest_ui_pos = {
                    x: innerWidth / 2 - quest_ui_w / 2,
                    y: innerWidth / 128,
                };
                const quest_body = ui.generate_rectangle(
                    quest_ui_pos.x,
                    quest_ui_pos.y,
                    quest_ui_w,
                    quest_ui_h,
                    ui.colors.body,
                    true,
                    ui.colors.border,
                    10
                );
                const quest_text = ui.generate_text(
                    [`Quest Name`, `Quest Objective`, `Quest Giver`],
                    ui.font_sizes.normal,
                    {
                        x: quest_ui_pos.x + quest_ui_w / 2,
                        y: quest_ui_pos.y + quest_ui_h / 2 - innerHeight / 16,
                    },
                    "center",
                    ui.colors.text
                );
                quest_text.update = (core, self, delta) => {
                    const quest =
                        core._get_object_by_identifier(
                            "quest_manager"
                        ).current_quest;
                    if (quest) {
                        self.text = [quest.name, quest.objective, quest.giver];
                    } else {
                        self.text = [];
                    }
                };
                ui.add_element(ui, [quest_text], "quest_ui", true);
            },
            update: (core, self, delta) => {
                // Check quest progress
                if (!self.current_quest) return;
                if (!self.current_quest.trigger) return;
                const player_pos =
                    core._get_object_by_identifier("player").global_position;
                if (
                    player_pos.distance(self.current_quest.trigger.location) <
                    self.current_quest.trigger.radius
                ) {
                    // Completed quest
                    self.current_quest.complete(core, self);
                }
            },
            generate_quest: () => {
                const quest = {
                    name: "Generated quest",
                    objective: "Go to x=48000, y=53000",
                    giver: "Tester",
                    trigger: {
                        location: {
                            x: 48000,
                            y: 53000,
                        },
                        radius: 150,
                    },
                    complete: (core, self) => {
                        self.current_quest = null;
                    },
                };

                return quest;
            },
        },
        planet_manager,
        player,
        background,
    ],
};

export default Game;
