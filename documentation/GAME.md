# 2112 Space Game Documentation

## Table of Contents

1. [Game Overview](#game-overview)
2. [Game Mechanics](#game-mechanics)
3. [Game Objects](#game-objects)
4. [Economic System](#economic-system)
5. [User Interface](#user-interface)
6. [Controls](#controls)
7. [Game World](#game-world)
8. [Strategy Guide](#strategy-guide)
9. [Technical Implementation](#technical-implementation)

---

## Game Overview

**2112** is an open-world space trading and exploration game set in the year 2112. Players pilot a spacecraft through a vast universe, trading goods between planets, managing resources, and exploring the cosmos.

### Core Gameplay Loop

1. **Explore** - Navigate through space discovering new planets
2. **Trade** - Buy low, sell high across different planetary markets
3. **Manage** - Balance fuel, cargo, and finances
4. **Expand** - Grow your wealth and trading capabilities

### Game Features

- **Massive Universe**: 1000 procedurally generated planets
- **Dynamic Economy**: Variable pricing based on supply and demand
- **Resource Management**: Fuel consumption and cargo capacity
- **Intuitive Controls**: Simple keyboard and touch controls
- **Responsive Design**: Playable on desktop and mobile devices

---

## Game Mechanics

### Movement System

The game uses realistic physics-based movement:

- **Thrust Control**: Adjustable thrust from 0% to 100%
- **Rotation**: Smooth left/right rotation with momentum
- **Velocity Decay**: Natural speed reduction over time
- **Fuel Consumption**: Dynamic fuel usage based on thrust level

#### Movement Physics

```javascript
// Acceleration based on thrust and direction
acceleration = direction * speed * thrust;

// Velocity accumulates over time
velocity += acceleration * deltaTime;

// Natural speed decay
velocity *= speedDecayFactor; // 0.98

// Position updates
position += velocity * deltaTime;
```

### Resource Management

#### Fuel System
- **Capacity**: 1000 liters maximum
- **Consumption**: Varies with thrust level (0.01L base + thrust-dependent)
- **Emergency Mode**: Reduced thrust when fuel is depleted
- **Refueling**: Available at fuel stations (fuel planets)

#### Cargo System
- **Limited Storage**: Finite cargo capacity for trade goods
- **Item Stacking**: Same items automatically stack
- **Weight Management**: Different items have different space requirements

---

## Game Objects

### Player Ship

The central entity controlled by the player.

**Properties:**
- Position and velocity in 2D space
- Rotation and thrust controls
- Fuel gauge and storage capacity
- Wallet (cash and bank accounts)

**Abilities:**
- Navigate through space
- Land on planets for trading
- Store and transport cargo

### Planets

Economic hubs and points of interest in the universe.

#### Planet Types

1. **Fuel Planets**
   - Buy and sell fuel
   - Essential for long-distance travel
   - Usually have competitive fuel prices

2. **Mining Planets**
   - Sell raw materials (coal, gold, uranium, special shards)
   - Buy refined goods
   - Source of rare and valuable resources

#### Planet Properties

- **Unique Names**: Generated from predefined name lists
- **Variable Sizes**: 200-500 pixel radius
- **Rotation**: Animated spinning at different speeds
- **Economy**: Dynamic pricing and resource availability

### Items and Resources

Trade goods form the backbone of the economy.

#### Resource Types

| Resource | Description | Price Range | Unit |
|----------|-------------|-------------|------|
| Fuel | Essential for space travel | $2-10 | Liters |
| Coal | Common mineral | $1-3 | Kilograms |
| Uranium | Radioactive material | $2000-2250 | Kilograms |
| Gold | Precious metal | $20000-25000 | Kilograms |
| Special Shards | Rare alien artifacts | $50000-70000 | Pieces |

#### Resource Properties

- **Tradeability**: Can be bought and sold
- **Usability**: Can be consumed if applicable
- **Stacking**: Same items combine in inventory
- **Weight**: Different space requirements per unit

---

## Economic System

### Market Mechanics

The game features a dynamic economy with several key principles:

#### Pricing System

- **Base Prices**: Each item has a minimum and maximum price
- **Market Variance**: Actual prices fluctuate within ranges
- **Buy/Sell Spread**: Planets buy at 90% and sell at 110% of base price
- **Supply Limits**: Planets have finite inventory

#### Trading Strategy

1. **Arbitrage**: Buy low, sell high between different planets
2. **Route Planning**: Consider fuel costs vs. profit margins
3. **Supply Management**: Monitor planetary inventories for opportunities
4. **Risk Assessment**: Balance high-value trades with fuel requirements

### Economic Balance

- **Fuel Costs**: Proportional to distance traveled
- **Profit Margins**: Vary by item type and scarcity
- **Market Saturation**: Prices may fluctuate with player activity
- **Progression**: Starting capital supports initial trading runs

---

## User Interface

### HUD Elements

#### Main Dashboard
- **Position Coordinates**: Current X,Y location in space
- **Fuel Gauge**: Visual representation and numerical display
- **Thrust Control**: Visual and numerical thrust indicator
- **Control Buttons**: Quick access to ship controls

#### Ship Controls Panel
- **Thrust Presets**: 0%, 33%, 67%, 100% buttons
- **Rotation Controls**: Left/Right turn buttons
- **Toggle Visibility**: Show/hide dashboard

#### Inventory System
- **Wallet Display**: Cash and bank balance
- **Cargo Manifest**: Item list with quantities and properties
- **Item Information**: Tradeability and usability indicators

#### Planet Interface

**Planet Name Display**
- Appears when within planet interaction range
- Shows planet name and type
- "Open" button to access trading menu

**Trading Menu**
- **Resource List**: All available items with prices
- **Buy/Sell Buttons**: Interactive trading controls
- **Inventory Display**: Planet's current stock levels
- **Transaction Interface**: Amount selection and confirmation

#### Trading Dialog

**Amount Selection**
- Increment/decrement buttons (+/- 1, 10, 100)
- Real-time value calculation
- Affordability and availability checks

**Transaction Display**
- Player's current inventory and cash
- Planet's inventory and cash
- Trade value calculation
- Confirm/Cancel options

### Visual Feedback

- **Interaction Range**: Visual circle around approachable planets
- **Fuel Warning**: Real-time consumption display
- **Debug Information**: Toggle-able performance metrics
- **Responsive Design**: Adapts to different screen sizes

---

## Controls

### Keyboard Controls

| Key | Function |
|-----|----------|
| W | Increase thrust |
| S | Decrease thrust |
| A | Rotate left |
| D | Rotate right |
| Space | Toggle debug display |

### Mouse/Touch Controls

| Element | Function |
|---------|----------|
| Thrust Buttons | Set thrust to preset levels (0%, 33%, 67%, 100%) |
| Rotation Buttons | Continuous rotation while held |
| Inventory Toggle | Open/close inventory screen |
| Planet Menu | Access trading when in range |
| Trade Buttons | Buy/sell specific resources |
| Amount Controls | Adjust trade quantities |

### Control Features

- **Responsive**: Works on both desktop and mobile
- **Intuitive**: Clear visual feedback
- **Accessibility**: Large touch targets for mobile devices
- **Customizable**: Multiple control schemes for different playstyles

---

## Game World

### Universe Scale

- **Size**: 100,000 x 100,000 coordinate space
- **Planet Count**: 1000 procedurally generated planets
- **Render Distance**: 3000px from player
- **Update Distance**: 1500px from player

### Planet Distribution

- **Random Placement**: Uniform distribution across universe
- **Variety**: Mix of fuel and mining planets
- **No Collisions**: Planets positioned to prevent overlap
- **Strategic Spacing**: Balanced for gameplay flow

### Visual Design

- **Parallax Background**: Multi-layer space backdrop
- **Planet Variety**: Different textures and colors
- **Lighting Effects**: Subtle glow around planets
- **Smooth Animations**: Continuous rotation and movement

---

## Strategy Guide

### Getting Started

1. **Initial Fuel**: Start with 500L of fuel
2. **Starting Cash**: $500 for initial trades
3. **Nearby Resources**: Check local planets for opportunities
4. **Fuel Management**: Monitor fuel levels constantly

### Early Game Strategy

1. **Local Trading**: Start with nearby planets to minimize fuel costs
2. **Fuel Focus**: Establish reliable fuel supply chain
3. **Small Profits**: Focus on coal and fuel trades initially
4. **Route Planning**: Plan efficient trading routes

### Mid Game Development

1. **Expansion**: Increase range with better fuel management
2. **Higher Value**: Move into gold and uranium trading
3. **Market Analysis**: Identify profitable trading patterns
4. **Capital Growth**: Accumulate wealth for larger trades

### Advanced Trading

1. **Rare Resources**: Target special shards for high profits
2. **Market Manipulation**: Monitor and respond to price changes
3. **Efficiency**: Optimize routes for maximum profit per fuel unit
4. **Risk Management**: Balance high-risk, high-reward trades

### Pro Tips

- **Fuel Efficiency**: Use minimal thrust for maximum distance
- **Price Comparison**: Always compare prices before trading
- **Inventory Management**: Keep space available for good deals
- **Planet Knowledge**: Learn planet types and their specialties

---

## Technical Implementation

### Game Configuration

The game is configured in `client/space_game/game.js`:

```javascript
const Game = {
    internal_objects: ["input_manager", "ui_manager"],
    objects: [
        planet_manager,    // Generates and manages planets
        item_manager,      // Handles items and trading
        player,           // Player ship and controls
        background,       // Visual background
    ],
};
```

### Object Architecture

#### Planet Manager
- Generates 1000 planets on initialization
- Manages planet interactions and trading
- Handles proximity detection and UI updates

#### Item Manager
- Defines all tradeable resources
- Manages pricing and inventory systems
- Handles transaction processing

#### Player Object
- Implements physics-based movement
- Manages fuel and cargo systems
- Handles user input and UI integration

### Performance Optimizations

- **Distance Culling**: Objects only update/render within range
- **Efficient Rendering**: Layered drawing system
- **Memory Management**: Reusable objects and efficient data structures
- **Frame Rate**: Targets 60 FPS with delta time calculations

### Extensibility

The game is designed to be easily extended:

- **New Planet Types**: Add to `generate_planet_resources()` method
- **Additional Items**: Extend the items array in item_manager
- **New Features**: Create additional game objects and systems
- **UI Enhancements**: Extend HTML and CSS for new interfaces

---

## Troubleshooting

### Common Issues

1. **Can't Move**: Check if landed on planet
2. **No Trading**: Ensure within planet interaction range
3. **Out of Fuel**: Find nearest fuel planet
4. **Inventory Full**: Sell or use existing items

### Performance Tips

- **Close Background Tabs**: Free up system resources
- **Update Browser**: Ensure modern browser with good Canvas performance
- **Reduce Quality**: Lower render distances if needed
- **Clear Cache**: Refresh page if performance degrades

---

## Future Development

Potential areas for expansion:

- **Multiplayer**: Cooperative trading and exploration
- **More Resources**: Additional trade goods and planet types
- **Missions**: Quest system with specific objectives
- **Ship Upgrades**: Customizable spacecraft components
- **Factions**: Political system with allegiances
- **Events**: Random occurrences and emergencies

---

*For technical implementation details, see [S2D Engine Documentation](./S2D_ENGINE.md) and [API Reference](./API.md)*