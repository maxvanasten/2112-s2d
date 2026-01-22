# 2112 (S2D) - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [S2D Engine Documentation](./documentation/S2D_ENGINE.md)
5. [Game Documentation](./documentation/GAME.md)
6. [API Reference](./documentation/API.md)
7. [Development Guide](#development-guide)

---

## Project Overview

**2112 (S2D)** is an open-world sandbox space game built with JavaScript using the custom S2D (Simple 2D) game engine. The project demonstrates the capabilities of the S2D engine while providing an engaging space exploration and trading experience.

### Key Features

- **Open-world space exploration** with seamless navigation
- **Economic trading system** with planetary markets
- **Resource management** including fuel and cargo
- **Modular architecture** built on the S2D engine
- **Responsive web-based interface** with HTML5 Canvas rendering
- **Real-time physics simulation** for ship movement

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5 Canvas
- **Backend**: Node.js with Express.js
- **Styling**: Bootstrap 4 (Bootswatch Lumen theme)
- **Build Tools**: No bundlers - native ES6 modules
- **Development**: Nodemon for hot-reloading

---

## Architecture

The project follows a modular architecture with clear separation between the game engine and the game-specific logic:

```
2112-s2d/
├── client/                     # Frontend code
│   ├── s2d_engine/            # Custom 2D game engine
│   │   ├── core.js           # Main engine class
│   │   ├── internal_objects/ # Engine subsystems
│   │   └── utils/            # Utility classes
│   ├── space_game/           # Game-specific code
│   │   ├── game.js          # Game configuration
│   │   ├── game_objects/    # Game entities
│   │   └── assets/          # Game assets
│   ├── index.html            # Main HTML file
│   └── main.js              # Entry point
├── server.mjs                # Express server
├── package.json             # Dependencies
└── documentation/           # This documentation
```

### Core Components

1. **S2D Engine**: Provides core game engine functionality including rendering, input handling, and object management
2. **Game Objects**: Implement specific game entities (player, planets, items, etc.)
3. **UI Manager**: Handles all user interface interactions
4. **Server**: Serves static files and provides development environment

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/maxvanasten/2112-s2d.git
   cd 2112-s2d
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run devStart
   ```

4. **Start the production server**:
   ```bash
   npm start
   ```

5. **Access the game**:
   Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start production server
- `npm run devStart` - Start development server with hot-reload

---

## Development Guide

### Project Structure Explained

#### S2D Engine (`client/s2d_engine/`)

The engine is designed to be reusable across different 2D games:

- **core.js**: Main engine class handling game loop, rendering, and object management
- **internal_objects/**: Subsystems for input, tilemaps, and UI management
- **utils/**: Core utilities including GameObject, Vector2D, and Vector4D classes

#### Game Implementation (`client/space_game/`)

Game-specific code built on top of the S2D engine:

- **game.js**: Main game configuration and object registration
- **game_objects/**: Individual game entity implementations
- **assets/**: Textures, fonts, and other game resources

### Adding New Game Objects

1. Create a new object file in `client/space_game/game_objects/`
2. Export a configuration object with required properties:
   ```javascript
   export default {
       identifier: "unique_object_name",
       flags: ["ALWAYS_UPDATE", "ALWAYS_RENDER"],
       // ... other properties
   };
   ```
3. Register the object in `client/space_game/game.js`
4. Implement required methods: `init()`, `update()`, `render()`

### Customizing the Engine

The S2D engine is designed to be extensible:

- Modify `core.js` for engine-level changes
- Add new internal objects in `internal_objects/`
- Extend utility classes in `utils/`
- Create new game-specific systems as separate game objects

### Game Controls

#### Keyboard Controls
- **W**: Increase thrust
- **S**: Decrease thrust
- **A**: Rotate left
- **D**: Rotate right
- **Space**: Toggle debug info

#### Mouse/Touch Controls
- Click/touch UI buttons for ship controls and inventory management
- Interactive planet menus for trading

### Performance Considerations

- **Update Distance**: Only objects within 1500px of player are updated
- **Render Distance**: Only objects within 3000px of player are rendered
- **Frame Rate**: Targets 60 FPS with delta time calculations
- **Memory Management**: Object pooling and efficient sprite loading

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m "Add feature description"`
5. Push to the branch: `git push origin feature-name`
6. Create a pull request

### Code Style

- Use ES6+ syntax and modules
- Follow JSDoc conventions for documentation
- Maintain consistent indentation (2 spaces)
- Use descriptive variable and function names
- Add comments for complex logic

---

## License

This project is licensed under the ISC License - see the package.json file for details.

---

## Additional Documentation

- [S2D Engine Documentation](./documentation/S2D_ENGINE.md) - Detailed engine architecture and usage
- [Game Documentation](./documentation/GAME.md) - Game-specific features and mechanics
- [API Reference](./documentation/API.md) - Complete API documentation for all classes and methods

---

## Support

For issues, questions, or contributions:
- Create an issue on [GitHub](https://github.com/maxvanasten/2112-s2d/issues)
- Check the existing documentation first
- Provide detailed bug reports with steps to reproduce

---

*Last updated: January 2026*