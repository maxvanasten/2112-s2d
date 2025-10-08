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
            unit_short: "L",
            unit_full: "Liters"
        }
    ],
    get_item_ref: (self, identifier) => {
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
    get_item: (self, item_identifier) => {
        const item_ref = self.get_item_ref(self, item_identifier);

        return {
            id: item_ref.id,
            name: item_ref.name,
            unit_short: item_ref.unit_short,
            unit_full: item_ref.unit_full,
            buy_price: 0,
            sell_price: 0,
            amount: 0,
        }
    },
    generate_planet_resources: (self, planet_type) => {
        const resources = [];
        if (planet_type == "fuel_planet") {
            // Buy and sell fuel
            const fuel_item = self.get_item(self, "fuel");
            const base_price = self.generate_item_price(self, fuel_item.id);

            fuel_item.buy_price = (base_price * 1.2).toFixed(2);
            fuel_item.sell_price = (base_price * 0.8).toFixed(2);
            fuel_item.amount = Math.floor(Math.random() * 125000);

            resources.push(fuel_item);
        } else if (planet_type == "mining_planet") {
            // Buy ores
        } else if (planet_type == "industrial_planet") {
            // Sell ores and buy ores
        }

        return resources;
    },
    // An inventory is simply an array of itemstacks, an itemstack only holds the identifier and the amount of items
    add_to_inventory: (self, inventory, item_identifier, amount) => {
        // Check validity of item
        let result = false;
        self.items.forEach((item) => {
            if (item.id == item_identifier) result = item;
        })
        if (!result) return false;

        // Check if item exists already in inventory
        result = false;
        inventory.forEach((item) => {
            if (item.id == item_identifier) {
                // Add item to existing itemstack
                item.amount += amount;
                result = true;
            }
        })

        // Add new itemstack to inventory
        if (!result) {
            let itemstack = self.get_item(self, item_identifier);
            itemstack.amount = amount;
            inventory.push(itemstack)
        }
    },
    take_from_inventory: (self, inventory, item_identifier, amount) => {
        // Check validity of item
        let result = false;
        self.items.forEach((item) => {
            if (item.id == item_identifier) result = item;
        })
        if (!result) return false;

        // Check if item exists
        let itemstack = false;
        inventory.forEach((item) => {
            if (item.id == item_identifier) itemstack = item;
        })
        if (!itemstack) return false;
        if (itemstack.amount < amount) return false;
        if (itemstack.amount > amount) itemstack.amount -= amount;
        if (itemstack.amount == amount) inventory.splice(inventory.indexOf(itemstack), 1);
        return true;
    },
    init: (core, self) => {

    },
    update: (core, self, delta) => {

    },
}