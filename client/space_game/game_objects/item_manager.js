export default {
    identifier: "item_manager",
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER"],
    options: {},
    items: [
        {
            id: "fuel",
            name: "Fuel",
            min_price: 2,
            max_price: 200,
            unit: "/L",
            unit_name: "Liters"
        }
    ],
    get_item: (self, identifier) => {
        let found_item = false;
        self.items.forEach((item) => {
            if (item.id == identifier) found_item = item;
        })
        return found_item;
    },
    generate_item_price: (self, identifier) => {
        let price = 0;
        self.items.forEach((item) => {
            if (item.id == identifier) price = item.min_price + Math.random() * item.max_price;
        })
        return price;
    },
    generate_planet_resources: (self, planet_type) => {
        const resources = [];
        if (planet_type == "fuel_planet") {
            // Buy and sell fuel
            const fuel_item_ref = self.get_item(self, "fuel");
            const base_price = self.generate_item_price(self, fuel_item_ref.id);
            const fuel_item = {
                id: fuel_item_ref.id,
                name: fuel_item_ref.name,
                unit: fuel_item_ref.unit,
                unit_name: fuel_item_ref.unit_name,
                buy_price: (base_price * 1.2).toFixed(2),
                sell_price: (base_price * 0.8).toFixed(2),
                amount: Math.floor(Math.random() * 1250000)
            }
            resources.push(fuel_item);
        } else if (planet_type == "mining_planet") {
            // Buy ores
        } else if (planet_type == "industrial_planet") {
            // Sell ores and buy ores
        }

        return resources;
    },
    init: (core, self) => {

    },
    update: (core, self, delta) => {

    },
}