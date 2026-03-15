# Changelog

All notable changes to Birdie Book Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added

#### Core Features
- **Map Import**
  - OpenStreetMap integration via Leaflet.js
  - Search by course name or coordinates
  - Upload custom course images
  - Blank canvas option for custom designs

- **Drawing Tools**
  - Brush tool with customizable color and thickness
  - Freehand drawing on canvas
  - Smooth stroke rendering

- **Stamp System**
  - Predefined stamps: Tree, Bush, Hazard, Bunker, Water, Flag
  - Drag-and-drop stamp placement
  - Visual stamp selection interface

- **Measurement Tool**
  - Click-to-measure distances
  - Support for yards and meters
  - Visual measurement lines with labels
  - Measurement list in sidebar

- **Annotation System**
  - Text annotations at specific points
  - Custom notes for course strategy
  - Visual annotation markers

- **Layer Management**
  - Toggle visibility of map, drawings, measurements, and annotations
  - Independent layer control
  - Layer state persistence

- **File Operations**
  - Save projects as `.birdie` files (JSON format)
  - Load saved projects
  - Project state persistence (map view, drawings, measurements, annotations)

- **Print/Export**
  - PDF export functionality
  - Support for A4, A5, and A6 paper sizes
  - Portrait and landscape orientations
  - Print preview modal

#### User Interface
- Modern, intuitive UI design
- Responsive sidebar with tool options
- Canvas controls (zoom in/out, reset view)
- Header toolbar with file operations
- Layer visibility panel

#### Technical Features
- Electron.js desktop application
- Cross-platform support (Windows, macOS, Linux)
- IPC communication for file operations
- Canvas-based drawing system
- Multi-layer canvas architecture

### Documentation
- Comprehensive README.md
- API documentation (API.md)
- Architecture documentation (ARCHITECTURE.md)
- Developer guide (DEVELOPER.md)
- User manual (USER_MANUAL.md)
- Contributing guidelines (CONTRIBUTING.md)
- JSDoc comments for all functions

### Project Setup
- MIT License
- Updated .gitignore for Electron/Node.js
- Package.json with dependencies
- Build configuration

## [Unreleased]

### Planned Features

#### High Priority
- Improved measurement accuracy with proper map scale calculation
- Snap-to-edge feature for tracing edges on satellite imagery
- Undo/redo functionality
- Enhanced error handling and user feedback
- Unit tests and automated testing

#### Medium Priority
- Additional stamp types and custom stamps
- Custom color palettes
- Grid and guides for drawing
- Keyboard shortcuts
- Multi-hole support in single project

#### Low Priority
- Application themes
- Additional export formats (PNG, SVG)
- Cloud storage integration
- Online sharing and rating system
- Mobile app version
- Advanced analytics (optimal landing zones)

### Known Issues
- Measurement accuracy is approximate (needs proper map scale calculation)
- No undo/redo functionality
- Limited error handling for edge cases
- No keyboard shortcuts
- Single-hole projects only

---

## Version History

- **1.0.0** (2024-01-XX) - Initial release

---

## Release Notes Format

### [Version] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes to existing features

#### Deprecated
- Soon-to-be removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security updates

---

## How to Read This Changelog

- **Added:** New features
- **Changed:** Changes to existing functionality
- **Deprecated:** Features that will be removed
- **Removed:** Removed features
- **Fixed:** Bug fixes
- **Security:** Security-related changes

---

## Links

- [GitHub Repository](https://github.com/your-username/Birdie_Book_builder)
- [Issue Tracker](https://github.com/your-username/Birdie_Book_builder/issues)
- [Releases](https://github.com/your-username/Birdie_Book_builder/releases)
