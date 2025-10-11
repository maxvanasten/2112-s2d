export default {
    identifier: "item_manager",
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER"],
    options: {},
    items: [
        {
            id: "fuel",
            name: "Fuel",
            min_price: 2,
            max_price: 10,
            unit_short: "L",
            unit_full: "Liters"
        },
        {
            id: "uranium",
            name: "Uranium",
            min_price: 2000,
            max_price: 2250,
            unit_short: "KG",
            unit_full: "Kilograms"
        },
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
            is_useable: true,
            is_tradeable: true,
        }
    },
    generate_item: (self, identifier, amount, buy, sell) => {
        const item = self.get_item(self, identifier);

        const base_price = self.generate_item_price(self, item.id);
        if (buy) item.buy_price = (base_price * 1.1).toFixed(2);
        if (sell) item.sell_price = (base_price * 0.9).toFixed(2);
        item.amount = amount;

        return item;
    },
    generate_planet_resources: (self, planet_type) => {
        const resources = [];
        if (planet_type == "fuel_planet") {
            // Buy and sell fuel
            resources.push(self.generate_item(self, "fuel", Math.floor(Math.random() * 5000), true, true));
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