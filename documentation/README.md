# Documentation Index

Welcome to the complete documentation for the 2112 (S2D) project. This documentation covers everything from high-level project overview to detailed API references.

## Documentation Structure

### 📖 [Main Documentation](../DOCUMENTATION.md)
**Project overview, getting started guide, and development instructions**

- Project overview and features
- Installation and setup
- Development workflow
- Contributing guidelines
- Architecture overview

---

### 🚀 [S2D Engine Documentation](./S2D_ENGINE.md)
**Comprehensive guide to the S2D game engine**

**Topics Covered:**
- Engine architecture and design philosophy
- Core class and game loop management
- GameObject system and lifecycle
- Internal objects (Input, Tilemap, UI managers)
- Vector utilities and mathematics
- Rendering system and pipeline
- Input handling and actions
- Camera system and coordinate transforms
- Performance optimization techniques
- Engine extension and customization

**Who should read this:**
- Game developers using the S2D engine
- Contributors to the engine codebase
- Developers creating new games with S2D

---

### 🎮 [Game Documentation](./GAME.md)
**Complete guide to the 2112 space game**

**Topics Covered:**
- Game overview and objectives
- Core gameplay mechanics (movement, physics)
- Economic system and trading
- Resource management (fuel, cargo)
- Game objects (player, planets, items)
- User interface and controls
- Strategy guide and tips
- World generation and universe scale
- Technical implementation details

**Who should read this:**
- Players wanting to understand game mechanics
- Developers studying the game implementation
- Designers working on similar games

---

### 🔧 [API Reference](./API.md)
**Detailed API documentation for all classes and methods**

**Topics Covered:**
- Core class methods and properties
- GameObject base class reference
- Vector2D and Vector4D utilities
- Internal objects APIs
- Game object configuration options
- Input system API
- UI manager methods
- Error handling and best practices
- Performance considerations

**Who should read this:**
- Developers extending the game or engine
- Programmers implementing new features
- Anyone needing technical implementation details

---

## Quick Navigation

### For New Players
1. Read the [Game Overview](./GAME.md#game-overview)
2. Learn the [Controls](./GAME.md#controls)
3. Understand the [Economic System](./GAME.md#economic-system)
4. Check the [Strategy Guide](./GAME.md#strategy-guide)

### For Developers
1. Start with [Project Overview](../DOCUMENTATION.md#project-overview)
2. Understand the [Getting Started](../DOCUMENTATION.md#getting-started) process
3. Study the [S2D Engine](./S2D_ENGINE.md) architecture
4. Review the [API Reference](./API.md) for implementation details

### For Contributors
1. Read the [Development Guide](../DOCUMENTATION.md#development-guide)
2. Understand the [Engine Architecture](./S2D_ENGINE.md#core-architecture)
3. Review the [Code Style](../DOCUMENTATION.md#code-style) guidelines
4. Study the [Extending the Engine](./S2D_ENGINE.md#extending-the-engine) section

---

## Project Structure Reference

```
2112-s2d/
├── client/                     # Frontend code
│   ├── s2d_engine/            # S2D Engine
│   │   ├── core.js           # Main engine class
│   │   ├── internal_objects/  # Engine subsystems
│   │   └── utils/            # Utility classes
│   ├── space_game/           # Game-specific code
│   │   ├── game.js          # Game configuration
│   │   ├── game_objects/    # Game entities
│   │   └── assets/          # Game resources
│   ├── index.html            # Main HTML file
│   └── main.js              # Entry point
├── documentation/           # This documentation
├── server.mjs               # Express server
├── package.json            # Dependencies
└── DOCUMENTATION.md         # Main documentation
```

---

## Key Concepts

### S2D Engine
- **Modular Design**: Loosely coupled components
- **Performance Optimized**: Distance culling and efficient rendering
- **Extensible**: Easy to add new features and objects
- **Web Native**: Built for modern browsers with Canvas API

### Game Architecture
- **Entity-Component Pattern**: Flexible object system
- **Event-Driven UI**: Clean separation of game and interface
- **Resource Management**: Efficient asset loading and caching
- **Physics-Based Movement**: Realistic space navigation

### Economic System
- **Dynamic Pricing**: Supply and demand mechanics
- **Resource Types**: Multiple trade goods with different values
- **Strategic Depth**: Route planning and risk management

---

## Common Tasks

### Adding New Game Objects
1. Read [GameObject Configuration](./API.md#game-object-configuration)
2. Review [Game Objects in Game](./GAME.md#game-objects)
3. Follow the pattern in existing game objects

### Extending the Engine
1. Study [Core Architecture](./S2D_ENGINE.md#core-architecture)
2. Read [Extending the Engine](./S2D_ENGINE.md#extending-the-engine)
3. Follow best practices in [API Reference](./API.md)

### Debugging Issues
1. Check [Troubleshooting](./S2D_ENGINE.md#troubleshooting) for engine issues
2. Review [Game Troubleshooting](./GAME.md#troubleshooting) for game issues
3. Use [Error Handling](./API.md#error-handling) patterns

---

## Contributing

We welcome contributions to both the S2D engine and the 2112 game!

### Areas for Contribution

- **Engine Features**: New rendering modes, physics systems
- **Game Content**: New planets, resources, missions
- **Documentation**: Improvements, examples, tutorials
- **Performance**: Optimization and profiling
- **UI/UX**: Better interfaces and user experience

### Getting Started

1. Follow the [Getting Started](../DOCUMENTATION.md#getting-started) guide
2. Review the [Development Guide](../DOCUMENTATION.md#development-guide)
3. Understand the [Code Style](../DOCUMENTATION.md#code-style)
4. Submit issues and pull requests

---

## Support and Community

- **Issues**: [GitHub Issues](https://github.com/maxvanasten/2112-s2d/issues)
- **Documentation**: This comprehensive reference
- **Examples**: Code samples throughout the documentation
- **Community**: Contributions and discussions welcome

---

## Documentation Version

- **Engine Version**: S2D v1.0 (current implementation)
- **Game Version**: 2112 v0.5.2
- **Documentation Last Updated**: January 2026

---

*This documentation is a living document. Please contribute improvements and corrections to make it better for everyone.*