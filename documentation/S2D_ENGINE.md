# S2D Engine Documentation

## Table of Contents

1. [Overview](#overview)
2. [Core Architecture](#core-architecture)
3. [Game Objects](#game-objects)
4. [Internal Objects](#internal-objects)
5. [Utility Classes](#utility-classes)
6. [Rendering System](#rendering-system)
7. [Input System](#input-system)
8. [Camera System](#camera-system)
9. [Performance Optimization](#performance-optimization)
10. [Extending the Engine](#extending-the-engine)

---

## Overview

The **S2D (Simple 2D) Engine** is a lightweight, modular JavaScript game engine designed for creating 2D web games using HTML5 Canvas. It provides essential game development features while maintaining simplicity and extensibility.

### Design Philosophy

- **Modularity**: Components are loosely coupled and can be used independently
- **Performance**: Optimized for 60 FPS gameplay with efficient object management
- **Simplicity**: Clean API that's easy to understand and extend
- **Flexibility**: Game-specific logic is separated from engine code

---

## Core Architecture

### Main Class: `Core`

The `Core` class is the heart of the S2D engine, managing the entire game loop and coordinating all subsystems.

```javascript
import { Core } from "./s2d_engine/core.js";

const core = new Core();
core._import_game(Game);
core._connect_canvas("game_canvas", true);
core._start_game();
```

### Core Responsibilities

1. **Game Loop Management**: Maintains 60 FPS game loop with delta time calculations
2. **Object Management**: Spawns, updates, and destroys game objects
3. **Rendering Pipeline**: Handles all drawing operations and layer sorting
4. **Camera Control**: Manages viewport and world-to-screen transformations
5. **Performance Monitoring**: Tracks FPS and optimizes object updates/rendering

### Key Properties

```javascript
// Canvas Management
_main_canvas: {
    element: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    fullscreen: boolean
}

// Performance Tracking
_frames_per_second: number
_frame_record: number[]
_average_frames_per_second: number

// Object Management
_objects: GameObject[]
_player_object_identifier: string

// Camera System
_camera_position: Vector2D
_camera_offset: Vector2D
_canvas_center: Vector2D

// Distance Optimization
_update_distance: number    // Default: 1500px
_render_distance: number   // Default: 3000px
```

---

## Game Objects

### Base Class: `GameObject`

All game entities inherit from the `GameObject` base class, which provides essential properties and methods.

```javascript
import { GameObject } from "./s2d_engine/utils/game_object.js";

class CustomObject extends GameObject {
    constructor(identifier) {
        super(identifier);
        // Custom initialization
    }
    
    init(core, self) {
        // Called once when object is spawned
    }
    
    update(core, self, delta) {
        // Called every frame for game logic
    }
    
    render(core, self, context, position) {
        // Called every frame for drawing
    }
}
```

### Game Object Configuration

Game objects are typically defined as configuration objects:

```javascript
const playerObject = {
    identifier: "player",
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER", "IS_PLAYER"],
    sprite: {
        image_path: "assets/player.png",
        source_width: 64,
        source_height: 64,
        render_width: 64,
        render_height: 64
    },
    render_layer: 3,
    global_position: { x: 100, y: 100 },
    collision_box: { x: 0, y: 0, width: 64, height: 64 },
    
    // Lifecycle methods
    init: (core, self) => { /* initialization */ },
    update: (core, self, delta) => { /* game logic */ },
    render: (core, self, context, position) => { /* rendering */ },
    
    // Input actions
    actions: [
        {
            type: "keyboard",
            key: "w",
            while_key_down: (core, self) => { /* handle input */ }
        }
    ]
};
```

### Object Flags

- **ALWAYS_UPDATE**: Object updates regardless of distance from player
- **ALWAYS_RENDER**: Object renders regardless of distance from player
- **IS_PLAYER**: Marks object as the player (affects camera tracking)
- **USE_SPRITE**: Object renders a sprite image

### Render Layers

Objects are rendered in ascending order of their `render_layer` property:
- Lower numbers render first (background)
- Higher numbers render last (foreground, UI)

---

## Internal Objects

Internal objects provide engine subsystems that are automatically initialized when specified in the game configuration.

### Input Manager

Handles keyboard and mouse input processing.

```javascript
// Enable input manager in game configuration
const Game = {
    internal_objects: ["input_manager"],
    // ...
};
```

**Features:**
- Keyboard input with cooldown support
- Mouse click detection
- Touch input support
- Action-based input mapping

### Tilemap Manager

Manages tile-based levels and maps.

```javascript
const Game = {
    internal_objects: ["tilemap_manager"],
    tilemap: {
        // Tilemap configuration
    },
    // ...
};
```

**Features:**
- JSON-based tilemap loading
- Efficient tile rendering
- Spawn point management
- Collision detection with tiles

### UI Manager

Handles HTML UI element interactions and game-UI communication.

```javascript
const Game = {
    internal_objects: ["ui_manager"],
    // ...
};
```

**Features:**
- DOM element manipulation
- Event handling
- Visibility management
- Content updates

---

## Utility Classes

### Vector2D

Represents 2D positions, velocities, and directions.

```javascript
import { Vector2D } from "./s2d_engine/utils/vectors.js";

// Creation
const position = Vector2D.from_x_and_y(100, 200);
const velocity = Vector2D.from_angle(Math.PI / 4);

// Operations
const sum = position.add(velocity);
const distance = position.distance(otherPosition);
const normalized = velocity.normalize();
```

**Key Methods:**
- `add()`, `subtract()`, `multiply()`, `divide()`
- `scale()`, `normalize()`, `limit()`
- `magnitude()`, `distance()`, `angle()`
- `floor()` for pixel-perfect positioning

### Vector4D

Represents rectangles and bounding boxes.

```javascript
import { Vector4D } from "./s2d_engine/utils/vectors.js";

// Creation
const rect = Vector4D.from_x_and_y_and_width_and_height(x, y, width, height);
const bounds = Vector4D.from_size(sizeVector);
```

---

## Rendering System

### Canvas Management

The engine automatically manages canvas resizing and context:

```javascript
core._connect_canvas("canvas_id", true); // fullscreen
core._connect_canvas("canvas_id", false); // fixed size
```

### Sprite Rendering

Sprites are automatically loaded and rendered:

```javascript
sprite: {
    image_path: "assets/texture.png",
    source_width: 64,      // Original image dimensions
    source_height: 64,
    render_width: 32,       // Display dimensions
    render_height: 32
}
```

### Rotation and Transformation

Objects support rotation through the `rotation` property:

```javascript
update: (core, self, delta) => {
    self.rotation += 0.01; // Rotate continuously
}
```

### Custom Rendering

Override the `render` method for custom drawing:

```javascript
render: (core, self, context, position) => {
    context.fillStyle = "red";
    context.fillRect(position.x, position.y, 32, 32);
    
    // Custom drawing code
}
```

---

## Input System

### Keyboard Input

Define keyboard actions in the object configuration:

```javascript
actions: [
    {
        type: "keyboard",
        key: "w",
        while_key_down: (core, self) => {
            // Handle continuous key press
        },
        cooldown: true  // Prevent rapid triggering
    }
]
```

### Mouse Input

Mouse click handling:

```javascript
actions: [
    {
        type: "mouse",
        button: "left",  // "left", "right", "middle"
        on_click: (core, self) => {
            // Handle mouse click
        }
    }
]
```

### Touch Input

Touch events are automatically converted to mouse events for mobile compatibility.

---

## Camera System

### World-to-Screen Transformation

The engine handles coordinate conversion automatically:

```javascript
// Get mouse position in world coordinates
const worldMousePos = core._screen_to_global(mouseScreenPos);

// Convert world position to screen position
const screenPos = core._global_to_screen(worldPosition);
```

### Camera Following

The camera automatically follows the object marked with `IS_PLAYER` flag.

### Manual Camera Control

Override camera behavior:

```javascript
// In core update loop
_update_camera_position = () => {
    // Custom camera logic
    this._camera_position = customPosition;
};
```

---

## Performance Optimization

### Distance Culling

Objects outside the specified distances are skipped:

- **Update Distance**: Objects beyond this distance don't update (default: 1500px)
- **Render Distance**: Objects beyond this distance don't render (default: 3000px)

### Frame Rate Management

The engine maintains consistent frame timing:

```javascript
// Delta time is calculated automatically
delta = (current_time - last_time) / 1000;

// Use delta time for frame-independent movement
position.x += velocity.x * delta;
```

### Object Pooling

Consider reusing objects instead of spawning/destroying frequently.

### Efficient Rendering

- Use render layers effectively
- Minimize expensive operations in render methods
- Leverage sprite atlases when possible

---

## Extending the Engine

### Adding New Internal Objects

1. Create object in `internal_objects/` directory
2. Implement required methods: `init()`, update methods, etc.
3. Register in core's `_import_game()` method

```javascript
case "my_internal_object":
    my_object.init(this, my_object);
    my_object._is_initialized = true;
    this._objects["my_internal_object"] = my_object;
    break;
```

### Custom Game Object Types

Extend the GameObject base class:

```javascript
import { GameObject } from "./utils/game_object.js";

class AdvancedObject extends GameObject {
    constructor(identifier) {
        super(identifier);
        this.customProperty = "value";
    }
    
    customMethod() {
        // Custom functionality
    }
}
```

### Engine Configuration

Modify core properties for specific game needs:

```javascript
// Adjust optimization distances
core._update_distance = 2000;
core._render_distance = 4000;

// Enable debug features
core.flags.RENDER_COLLISION_BOXES = true;
```

### Plugin Architecture

The engine supports adding modular plugins through the internal object system.

---

## Best Practices

1. **Use Distance Culling**: Set appropriate update/render distances
2. **Optimize Render Order**: Arrange render layers for efficiency
3. **Pool Objects**: Reuse objects instead of frequent spawning
4. **Minimize State Changes**: Group similar rendering operations
5. **Use Delta Time**: Ensure frame-independent movement
6. **Profile Performance**: Monitor FPS and object counts
7. **Modular Design**: Keep game logic separate from engine code

---

## Troubleshooting

### Common Issues

1. **Objects Not Rendering**: Check render layer and distance settings
2. **Input Not Working**: Verify input manager is initialized
3. **Performance Issues**: Reduce update/render distances
4. **Sprite Not Loading**: Check image paths and network requests

### Debug Tools

Enable debug features:

```javascript
core.flags.RENDER_COLLISION_BOXES = true;
```

Use browser developer tools for performance profiling.

---

*For complete API documentation, see [API Reference](./API.md)*