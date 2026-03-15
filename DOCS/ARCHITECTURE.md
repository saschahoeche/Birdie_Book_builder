# Architecture Documentation

## Overview

Birdie Book Builder is a cross-platform desktop application built with Electron.js. It follows a client-server architecture pattern where the Electron main process acts as the server, and the renderer process handles the UI and user interactions.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Application                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  Main Process    │◄────►│ Renderer Process │        │
│  │  (Node.js)       │ IPC  │  (Chromium)      │        │
│  └──────────────────┘      └──────────────────┘        │
│         │                          │                    │
│         │                          │                    │
│         ▼                          ▼                    │
│  ┌──────────────┐         ┌──────────────┐            │
│  │ File System  │         │   Browser    │            │
│  │ Operations  │         │     APIs     │            │
│  └──────────────┘         └──────────────┘            │
│                                  │                      │
│                                  ▼                      │
│                          ┌──────────────┐              │
│                          │   External   │              │
│                          │     APIs     │              │
│                          │ (OpenStreetMap)             │
│                          └──────────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Main Process (`main.js`)

The main process is responsible for:

1. **Application Lifecycle Management**
   - Creating and managing application windows
   - Handling application events (ready, window-all-closed, activate)

2. **File System Operations**
   - Saving project files (`.birdie` format)
   - Loading project files
   - File dialog management

3. **IPC Communication**
   - Handling IPC requests from renderer process
   - Providing secure file access

**Key Responsibilities:**
- Window creation and management
- IPC handlers for file operations
- Application lifecycle events

### Renderer Process (`app.js`)

The renderer process handles:

1. **User Interface**
   - DOM manipulation
   - Event handling
   - UI state management

2. **Canvas Operations**
   - Drawing operations
   - Overlay rendering
   - Canvas state management

3. **Map Integration**
   - Leaflet.js map initialization
   - Map interactions
   - Tile layer management

4. **Tool Management**
   - Tool selection and state
   - Tool-specific operations
   - Tool UI updates

**Key Responsibilities:**
- User interaction handling
- Canvas drawing and rendering
- Map operations
- State management

## Data Flow

### Application State Management

The application uses a centralized state object (`state`) that contains all application data:

```
User Action → Event Handler → State Update → UI Update
```

**State Flow Example (Drawing):**
1. User clicks mouse → `handleMouseDown()`
2. State updated (`isDrawing = true`)
3. User moves mouse → `handleMouseMove()`
4. Canvas drawn → `drawContext.stroke()`
5. State updated (`lastX`, `lastY`)
6. User releases mouse → `handleMouseUp()`
7. State updated (`isDrawing = false`)

### File Operations Flow

**Save Flow:**
```
Renderer: saveProject()
    ↓
IPC: invoke('save-file', data)
    ↓
Main: ipcMain.handle('save-file')
    ↓
Main: dialog.showSaveDialog()
    ↓
Main: fs.writeFileSync()
    ↓
Main: return { success: true, path }
    ↓
Renderer: Display success message
```

**Load Flow:**
```
Renderer: loadProject()
    ↓
IPC: invoke('load-file')
    ↓
Main: ipcMain.handle('load-file')
    ↓
Main: dialog.showOpenDialog()
    ↓
Main: fs.readFileSync() + JSON.parse()
    ↓
Main: return { success: true, data }
    ↓
Renderer: Restore state from data
    ↓
Renderer: Redraw canvas
```

## Layer Architecture

The application uses a layered canvas approach:

```
┌─────────────────────────────────────┐
│      Overlay Canvas (Top)           │  ← Measurements, Annotations
├─────────────────────────────────────┤
│      Drawing Canvas (Middle)        │  ← User drawings, Stamps
├─────────────────────────────────────┤
│      Map Container (Bottom)         │  ← Leaflet map or image
└─────────────────────────────────────┘
```

**Canvas Layers:**

1. **Map Container** (`#map`)
   - Leaflet map instance
   - OpenStreetMap tiles or custom image overlay
   - Base layer for all operations

2. **Drawing Canvas** (`#drawCanvas`)
   - User-drawn brush strokes
   - Stamps (trees, hazards, etc.)
   - Interactive layer (receives mouse events)

3. **Overlay Canvas** (`#overlayCanvas`)
   - Measurements (lines and labels)
   - Annotations (text notes)
   - Non-interactive layer (display only)

## Technology Stack

### Core Technologies

- **Electron.js** (v28.0.0)
  - Cross-platform desktop framework
  - Main process: Node.js runtime
  - Renderer process: Chromium browser

- **Leaflet.js** (v1.9.4)
  - Interactive map library
  - Map tile management
  - Geocoding integration

- **jsPDF** (v2.5.1)
  - PDF generation
  - Print/export functionality

- **html2canvas** (v1.4.1)
  - Canvas capture
  - DOM to image conversion

### External Services

- **OpenStreetMap**
  - Map tiles
  - Nominatim geocoding API

## Design Patterns

### Module Pattern

Each file represents a module:
- `main.js` - Main process module
- `app.js` - Renderer process module
- `styles.css` - Styling module
- `index.html` - UI structure module

### Event-Driven Architecture

The application uses event-driven patterns:

1. **DOM Events**
   - User interactions (click, mousemove, etc.)
   - Form inputs (change, input)

2. **Electron Events**
   - Application lifecycle events
   - Window events

3. **Custom Events**
   - Map events (moveend, zoom)
   - Canvas events (resize)

### State Management Pattern

Centralized state object with direct manipulation:

```javascript
let state = {
  // Application state
};

// State updates trigger UI updates
function updateState(key, value) {
  state[key] = value;
  redraw(); // Update UI
}
```

## Security Considerations

### Current Implementation

1. **Node Integration**
   - `nodeIntegration: true` - Allows Node.js APIs in renderer
   - `contextIsolation: false` - Disables context isolation

**Note:** For production, consider enabling context isolation and using preload scripts for better security.

2. **File System Access**
   - Limited to user-selected files via dialogs
   - No automatic file system access

3. **Network Access**
   - OpenStreetMap API calls
   - Nominatim geocoding API
   - No authentication required (public APIs)

### Recommended Security Improvements

1. Enable context isolation
2. Use preload scripts for IPC
3. Validate all file inputs
4. Sanitize user inputs
5. Implement CSP (Content Security Policy)

## Performance Considerations

### Canvas Optimization

- Separate canvases for drawing and overlays
- Redraw only when necessary
- Use `requestAnimationFrame` for smooth animations (future enhancement)

### Map Performance

- Tile caching handled by Leaflet
- Lazy loading of map tiles
- Efficient layer management

### Memory Management

- Canvas data stored as base64 in save files
- Large images may impact memory
- Consider image compression for large files

## Scalability Considerations

### Current Limitations

1. **Single Window**
   - One project per window
   - No multi-project support

2. **Local Storage Only**
   - No cloud sync
   - No collaboration features

3. **Single User**
   - No user accounts
   - No sharing capabilities

### Future Enhancements

1. **Multi-Window Support**
   - Multiple projects simultaneously
   - Window management

2. **Cloud Storage**
   - Online backup
   - Cross-device sync

3. **Collaboration**
   - Real-time sharing
   - Multi-user editing

## Extension Points

### Adding New Tools

1. Add tool button to HTML
2. Add tool handler function
3. Update `setupToolButtons()`
4. Add tool-specific options panel

### Adding New Stamps

1. Add emoji/icon to `drawStamp()` emojiMap
2. Add stamp item to HTML sidebar
3. Update stamp selection logic

### Adding New Export Formats

1. Add export function
2. Add format selection UI
3. Integrate with export library
4. Update print modal

## Dependencies

### Production Dependencies

```json
{
  "leaflet": "^1.9.4",
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1"
}
```

### Development Dependencies

```json
{
  "electron": "^28.0.0",
  "electron-builder": "^24.9.1"
}
```

## Build and Distribution

### Development Build

```bash
npm start
```

### Production Build

```bash
npm run build
```

Uses `electron-builder` for creating distributables:
- Windows: `.exe` installer
- macOS: `.dmg` or `.app`
- Linux: `.deb`, `.rpm`, or AppImage

## Testing Strategy

### Current State

- Manual testing only
- No automated tests

### Recommended Testing

1. **Unit Tests**
   - Function testing
   - State management testing

2. **Integration Tests**
   - IPC communication
   - File operations

3. **E2E Tests**
   - User workflows
   - Cross-platform testing

## Deployment Architecture

```
Development Environment
    ↓
Build Process (electron-builder)
    ↓
Platform-Specific Distributables
    ↓
Distribution Channels
    - GitHub Releases
    - Direct Download
    - Package Managers (future)
```

## Future Architecture Considerations

1. **Plugin System**
   - Custom tool plugins
   - Export format plugins

2. **Service Layer**
   - Separate business logic
   - API abstraction

3. **State Management Library**
   - Redux or similar
   - Better state management

4. **Component Framework**
   - React or Vue integration
   - Component-based UI
