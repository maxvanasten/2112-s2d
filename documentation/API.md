# API Reference

## Table of Contents

1. [Core Class](#core-class)
2. [GameObject Class](#gameobject-class)
3. [Vector2D Class](#vector2d-class)
4. [Vector4D Class](#vector4d-class)
5. [Internal Objects](#internal-objects)
6. [Game Object Configuration](#game-object-configuration)
7. [Input System API](#input-system-api)
8. [UI Manager API](#ui-manager-api)

---

## Core Class

The main engine class that manages the game loop and coordinates all systems.

### Constructor

```javascript
const core = new Core();
```

### Public Methods

#### `_import_game(game)`

Imports game configuration and initializes all objects.

**Parameters:**
- `game` (Object): Game configuration object

**Example:**
```javascript
core._import_game({
    internal_objects: ["input_manager", "ui_manager"],
    objects: [player, planet_manager, item_manager]
});
```

#### `_connect_canvas(id, fullscreen)`

Connects the engine to an HTML canvas element.

**Parameters:**
- `id` (string): Canvas element ID
- `fullscreen` (boolean): Whether to use fullscreen mode

**Example:**
```javascript
core._connect_canvas("game_canvas", true);
```

#### `_start_game()`

Starts the main game loop.

**Example:**
```javascript
core._start_game();
```

#### `_get_object_by_identifier(identifier)`

Retrieves a game object by its identifier.

**Parameters:**
- `identifier` (string): Object identifier

**Returns:**
- `GameObject|false`: The requested object or false if not found

**Example:**
```javascript
const player = core._get_object_by_identifier("player");
```

#### `_get_objects_by_group(group)`

Retrieves all objects belonging to a specific group.

**Parameters:**
- `group` (string): Group name

**Returns:**
- `Array`: Array of matching objects

#### `_global_to_screen(globalPosition)`

Converts world coordinates to screen coordinates.

**Parameters:**
- `globalPosition` (Vector2D): World position

**Returns:**
- `Vector2D`: Screen position

#### `_screen_to_global(screenPosition)`

Converts screen coordinates to world coordinates.

**Parameters:**
- `screenPosition` (Vector2D): Screen position

**Returns:**
- `Vector2D`: World position

#### `_get_mouse_position()`

Returns current mouse position in world coordinates.

**Returns:**
- `Vector2D`: Mouse world position

### Public Properties

- `_main_canvas`: Canvas information and context
- `_camera_position`: Current camera world position
- `_update_distance`: Distance for object updates (default: 1500)
- `_render_distance`: Distance for object rendering (default: 3000)
- `_average_frames_per_second`: Current FPS
- `flags`: Engine flags (e.g., RENDER_COLLISION_BOXES)

---

## GameObject Class

Base class for all game objects in the engine.

### Constructor

```javascript
const gameObject = new GameObject("identifier");
```

**Parameters:**
- `identifier` (string): Unique object identifier

### Properties

#### Core Properties

- `identifier` (string): Unique object identifier
- `_is_initialized` (boolean): Whether object has been initialized
- `flags` (Object): Object behavior flags
  - `ALWAYS_UPDATE`: Update regardless of distance
  - `ALWAYS_RENDER`: Render regardless of distance
  - `IS_PLAYER`: Mark as player object
  - `USE_SPRITE`: Render sprite image
  - `IS_UI`: Render in screen coordinates

#### Transform Properties

- `global_position` (Vector2D): World position
- `render_layer` (number): Rendering order (lower = background)
- `rotation` (number): Rotation angle in radians
- `scale` (number): Scale factor

#### Collision Properties

- `bounding_box` (Vector4D): Object boundaries
- `collision_box` (Vector4D): Collision detection area

#### Sprite Properties

- `sprite` (Object): Sprite configuration
  - `image` (Image): Loaded image object
  - `image_path` (string): Path to image file
  - `source_width` (number): Original image width
  - `source_height` (number): Original image height
  - `render_width` (number): Display width
  - `render_height` (number): Display height
  - `ready` (boolean): Whether image is loaded

### Methods

#### `init(core, self)`

Called once when object is initialized.

**Parameters:**
- `core` (Core): Engine instance
- `self` (GameObject): Reference to self

#### `update(core, self, delta)`

Called every frame for game logic.

**Parameters:**
- `core` (Core): Engine instance
- `self` (GameObject): Reference to self
- `delta` (number): Time since last frame in seconds

#### `render(core, self, context, position)`

Called every frame for drawing.

**Parameters:**
- `core` (Core): Engine instance
- `self` (GameObject): Reference to self
- `context` (CanvasRenderingContext2D): Rendering context
- `position` (Vector2D): Screen position for rendering

---

## Vector2D Class

Represents 2D vectors for positions, velocities, and directions.

### Constructor

```javascript
const vector = new Vector2D(x, y);
```

**Parameters:**
- `x` (number): X component
- `y` (number): Y component

### Static Methods

#### `ZERO()`

Creates a zero vector.

```javascript
const zero = Vector2D.ZERO(); // (0, 0)
```

#### `from_x_and_y(x, y)`

Creates vector from coordinates.

```javascript
const vector = Vector2D.from_x_and_y(100, 200);
```

#### `from_angle(angle)`

Creates unit vector from angle.

```javascript
const direction = Vector2D.from_angle(Math.PI / 4);
```

#### `copy(vector)`

Creates copy of existing vector.

```javascript
const copy = Vector2D.copy(original);
```

### Instance Methods

#### `add(vector2d)`

Vector addition.

```javascript
const result = vectorA.add(vectorB);
```

#### `subtract(vector2d)`

Vector subtraction.

```javascript
const result = vectorA.subtract(vectorB);
```

#### `multiply(vector2d)`

Vector multiplication.

```javascript
const result = vectorA.multiply(vectorB);
```

#### `scale(scalar)`

Scalar multiplication.

```javascript
const result = vector.scale(2.5);
```

#### `divide(number)`

Scalar division.

```javascript
const result = vector.divide(3.0);
```

#### `magnitude()`

Calculates vector length.

```javascript
const length = vector.magnitude();
```

#### `normalize()`

Creates unit vector.

```javascript
const unit = vector.normalize();
```

#### `limit(maxMagnitude)`

Limits vector magnitude.

```javascript
const limited = vector.limit(10.0);
```

#### `distance(vector2d)`

Calculates distance to another vector.

```javascript
const dist = vectorA.distance(vectorB);
```

#### `angle()`

Returns vector angle.

```javascript
const angle = vector.angle();
```

#### `floor()`

Floors components to integers.

```javascript
const pixelPerfect = vector.floor();
```

---

## Vector4D Class

Represents 4D vectors for rectangles and bounding boxes.

### Constructor

```javascript
const rect = new Vector4D(x, y, width, height);
```

**Parameters:**
- `x` (number): X position
- `y` (number): Y position
- `width` (number): Width
- `height` (number): Height

### Static Methods

#### `ZERO()`

Creates zero rectangle.

```javascript
const zero = Vector4D.ZERO(); // (0, 0, 0, 0)
```

#### `from_x_and_y_and_width_and_height(x, y, width, height)`

Creates rectangle from parameters.

```javascript
const rect = Vector4D.from_x_and_y_and_width_and_height(10, 20, 100, 50);
```

#### `from_vector2d(vector2d)`

Creates rectangle from 2D vector.

```javascript
const rect = Vector4D.from_vector2d(position);
```

#### `from_vector2d_and_size(vector2d, size)`

Creates rectangle from position and size.

```javascript
const rect = Vector4D.from_vector2d_and_size(position, size);
```

#### `from_size(size)`

Creates rectangle from size vector.

```javascript
const rect = Vector4D.from_size(sizeVector);
```

#### `copy(vector4d)`

Creates copy of existing rectangle.

```javascript
const copy = Vector4D.copy(original);
```

---

## Internal Objects

### Input Manager

Handles keyboard and mouse input processing.

#### Initialization

```javascript
const Game = {
    internal_objects: ["input_manager"],
    // ...
};
```

#### Action Configuration

```javascript
actions: [
    {
        type: "keyboard",
        key: "w",
        while_key_down: (core, self) => {
            // Handle continuous key press
        },
        cooldown: true, // Prevent rapid triggering
        cooldownTimer: 0
    },
    {
        type: "mouse",
        button: "left",
        on_click: (core, self) => {
            // Handle mouse click
        }
    }
]
```

#### Properties

- `actions` (Array): Array of action configurations
- `mouse` (Object): Current mouse position
- `keys` (Object): Current key states

### Tilemap Manager

Manages tile-based levels and maps.

#### Initialization

```javascript
const Game = {
    internal_objects: ["tilemap_manager"],
    tilemap: {
        // Tilemap configuration
    },
    // ...
};
```

#### Methods

- `is_loaded()`: Check if tilemap is loaded
- `get_tiles(tileIdentifier)`: Get tiles by identifier
- `get_spawn_position(tileIdentifier)`: Get random spawn position

### UI Manager

Handles HTML UI element manipulation.

#### Initialization

```javascript
const Game = {
    internal_objects: ["ui_manager"],
    // ...
};
```

#### Methods

##### `getElement(identifier)`

Gets DOM element by ID.

```javascript
const element = ui.getElement("button_id");
```

##### `setInnerHTML(identifier, content)`

Sets element HTML content.

```javascript
ui.setInnerHTML(ui, "status_text", "Status: Active");
```

##### `toggleVisibility(identifier)`

Toggles element visibility.

```javascript
ui.toggleVisibility(ui, "menu_panel");
```

##### `setVisibility(identifier, visibility)`

Sets element visibility.

```javascript
ui.setVisibility(ui, "loading_screen", "hidden");
```

##### `_get_visibility(identifier)`

Gets current visibility state.

```javascript
const isVisible = ui._get_visibility(ui, "dialog");
```

##### `_get_elements(className)`

Gets elements by class name.

```javascript
const buttons = ui._get_elements("control_button");
```

##### `_get_number_from(id)`

Gets numeric value from element content.

```javascript
const value = ui._get_number_from("score_display");
```

---

## Game Object Configuration

### Complete Object Definition

```javascript
const gameObject = {
    // Core identification
    identifier: "unique_object_name",
    
    // Behavior flags
    flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER", "IS_PLAYER", "USE_SPRITE"],
    
    // Rendering
    sprite: {
        image_path: "assets/texture.png",
        source_width: 64,
        source_height: 64,
        render_width: 32,
        render_height: 32
    },
    render_layer: 3,
    
    // Position and size
    global_position: { x: 100, y: 200 },
    bounding_box: { x: 0, y: 0, width: 32, height: 32 },
    collision_box: { x: 0, y: 0, width: 32, height: 32 },
    
    // Custom properties
    custom_property: "value",
    number_property: 42,
    
    // Lifecycle methods
    init: (core, self) => {
        // Initialization code
        self.custom_property = "initialized";
    },
    
    update: (core, self, delta) => {
        // Game logic code
        self.custom_property += delta;
    },
    
    render: (core, self, context, position) => {
        // Custom rendering code
        context.fillStyle = "red";
        context.fillRect(position.x, position.y, 32, 32);
    },
    
    // Input handling
    actions: [
        {
            type: "keyboard",
            key: "w",
            while_key_down: (core, self) => {
                // Handle input
            }
        }
    ]
};
```

### Flag Reference

| Flag | Description |
|------|-------------|
| `ALWAYS_UPDATE` | Update regardless of distance from player |
| `ALWAYS_RENDER` | Render regardless of distance from player |
| `IS_PLAYER` | Mark as player object (affects camera) |
| `USE_SPRITE` | Enable sprite rendering |
| `IS_UI` | Render in screen coordinates |

### Render Layer Guidelines

- **-10 to -1**: Background elements
- **0**: Default layer (ground, static objects)
- **1-5**: Game objects (characters, items)
- **6-9**: Effects and overlays
- **10+**: UI elements

---

## Input System API

### Key Codes

Common keyboard key codes:

- Letters: `"a"`, `"b"`, `"c"`, etc.
- Numbers: `"0"`, `"1"`, `"2"`, etc.
- Special: `" "`, `"Enter"`, `"Escape"`, `"ArrowUp"`, etc.

### Mouse Buttons

- `"left"`: Left mouse button
- `"right"`: Right mouse button
- `"middle"`: Middle mouse button

### Action Types

#### Keyboard Action

```javascript
{
    type: "keyboard",
    key: "w",
    while_key_down: (core, self) => {
        // Continuous action while key is held
    },
    cooldown: true, // Prevent rapid triggering
    cooldownTimer: 0 // Internal timer
}
```

#### Mouse Action

```javascript
{
    type: "mouse",
    button: "left",
    on_click: (core, self) => {
        // Single click action
    }
}
```

---

## UI Manager API

### Element Manipulation

The UI Manager provides convenient methods for DOM manipulation:

```javascript
const ui = core._get_object_by_identifier("ui_manager");

// Get element
const element = ui.getElement("my_element");

// Set content
ui.setInnerHTML(ui, "status_text", "Game Started");

// Toggle visibility
ui.toggleVisibility(ui, "menu_panel");

// Set specific visibility
ui.setVisibility(ui, "loading_screen", "visible");

// Check visibility
const isVisible = ui._get_visibility(ui, "dialog");

// Get multiple elements
const buttons = ui._get_elements("action_button");

// Extract numeric value
const score = ui._get_number_from("score_display");
```

### Common UI Patterns

#### Toggle Menu

```javascript
const toggleMenu = () => {
    const ui = core._get_object_by_identifier("ui_manager");
    ui.toggleVisibility(ui, "game_menu");
};

// Assign to button
document.getElementById("menu_button").onclick = toggleMenu;
```

#### Update Status

```javascript
const updateStatus = (status) => {
    const ui = core._get_object_by_identifier("ui_manager");
    ui.setInnerHTML(ui, "status_text", `Status: ${status}`);
};
```

#### Dynamic Content

```javascript
const updateInventory = (items) => {
    const ui = core._get_object_by_identifier("ui_manager");
    let html = "<ul>";
    items.forEach(item => {
        html += `<li>${item.name}: ${item.amount}</li>`;
    });
    html += "</ul>";
    ui.setInnerHTML(ui, "inventory_list", html);
};
```

---

## Error Handling

### Common Errors and Solutions

#### Object Not Found

```javascript
const object = core._get_object_by_identifier("nonexistent");
if (!object) {
    console.error("Object not found!");
}
```

#### Invalid Vector Operations

```javascript
// Check for valid vectors before operations
if (vector && typeof vector.magnitude === 'function') {
    const length = vector.magnitude();
}
```

#### Missing UI Elements

```javascript
const element = ui.getElement("missing_element");
if (!element) {
    console.warn("UI element not found!");
    return;
}
```

---

## Performance Considerations

### Object Management

```javascript
// Use flags efficiently
flags: ["ALWAYS_UPDATE"] // Only when necessary

// Set appropriate render layers
render_layer: 0 // Background elements
render_layer: 5 // Active game objects
render_layer: 10 // UI elements
```

### Rendering Optimization

```javascript
// Minimal operations in render loop
render: (core, self, context, position) => {
    // Avoid expensive calculations here
    // Cache values where possible
    
    if (self.needsRedraw) {
        // Only redraw when necessary
        self.renderCached = true;
        self.needsRedraw = false;
    }
}
```

### Memory Management

```javascript
// Clean up resources
destroy: (core, self) => {
    if (self.sprite && self.sprite.image) {
        self.sprite.image.onload = null;
    }
}
```

---

*For usage examples and implementation details, see [S2D Engine Documentation](./S2D_ENGINE.md) and [Game Documentation](./GAME.md)*