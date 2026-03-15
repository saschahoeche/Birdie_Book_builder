# API Documentation

## Overview

This document describes the internal APIs and IPC (Inter-Process Communication) interfaces used in Birdie Book Builder.

## IPC Communication

Birdie Book Builder uses Electron's IPC (Inter-Process Communication) to facilitate communication between the main process and renderer process.

### Main Process IPC Handlers

#### `save-file`

Saves a Birdie Book project to a `.birdie` file.

**Handler:** `ipcMain.handle('save-file', async (event, data))`

**Parameters:**
- `event` (Electron.IpcMainInvokeEvent): IPC event object
- `data` (Object): Project data to save

**Data Structure:**
```javascript
{
  version: string,           // Project version (e.g., "1.0")
  mapCenter: L.LatLng,      // Leaflet LatLng object with lat/lng
  mapZoom: number,          // Map zoom level
  measurements: Array,      // Array of measurement objects
  annotations: Array,       // Array of annotation objects
  brushColor: string,       // Hex color string (e.g., "#4CAF50")
  brushThickness: number,   // Brush thickness in pixels
  canvasData: string        // Base64 encoded canvas image data
}
```

**Returns:**
```javascript
{
  success: boolean,         // Whether save was successful
  path?: string,           // File path if successful
  error?: string,          // Error message if failed
  canceled?: boolean       // Whether user canceled dialog
}
```

**Example:**
```javascript
const result = await ipcRenderer.invoke('save-file', {
  version: '1.0',
  mapCenter: state.map.getCenter(),
  mapZoom: state.map.getZoom(),
  measurements: [],
  annotations: [],
  brushColor: '#4CAF50',
  brushThickness: 5,
  canvasData: canvas.toDataURL()
});
```

---

#### `load-file`

Loads a Birdie Book project from a `.birdie` file.

**Handler:** `ipcMain.handle('load-file', async ())`

**Parameters:** None

**Returns:**
```javascript
{
  success: boolean,         // Whether load was successful
  data?: Object,           // Parsed project data if successful
  path?: string,           // File path if successful
  error?: string,          // Error message if failed
  canceled?: boolean       // Whether user canceled dialog
}
```

**Data Structure (returned in `data`):**
```javascript
{
  version: string,
  mapCenter: { lat: number, lng: number },
  mapZoom: number,
  measurements: Array<{
    start: { x: number, y: number },
    end: { x: number, y: number },
    distance: string,
    unit: 'yards' | 'meters'
  }>,
  annotations: Array<{
    x: number,
    y: number,
    text: string
  }>,
  brushColor: string,
  brushThickness: number,
  canvasData: string
}
```

**Example:**
```javascript
const result = await ipcRenderer.invoke('load-file');
if (result.success) {
  const projectData = result.data;
  // Restore project state
}
```

---

## Application State API

### State Object Structure

The application maintains a global state object (`state`) that contains all application data:

```typescript
interface AppState {
  currentTool: 'brush' | 'stamp' | 'measure' | 'annotate';
  selectedStamp: string | null;
  map: L.Map | null;
  drawCanvas: HTMLCanvasElement | null;
  overlayCanvas: HTMLCanvasElement | null;
  drawContext: CanvasRenderingContext2D | null;
  overlayContext: CanvasRenderingContext2D | null;
  isDrawing: boolean;
  lastX: number;
  lastY: number;
  brushColor: string;
  brushThickness: number;
  measurements: Measurement[];
  annotations: Annotation[];
  currentMeasurement: Measurement | null;
  measureUnit: 'yards' | 'meters';
  layers: {
    map: boolean;
    drawings: boolean;
    measurements: boolean;
    annotations: boolean;
  };
}
```

### Measurement Object

```typescript
interface Measurement {
  start: { x: number, y: number };
  end: { x: number, y: number };
  distance: string;  // Formatted distance (e.g., "150.5")
  unit: 'yards' | 'meters';
}
```

### Annotation Object

```typescript
interface Annotation {
  x: number;
  y: number;
  text: string;
}
```

---

## Core Functions API

### Canvas Functions

#### `initializeCanvas()`

Initializes the drawing and overlay canvases, sets up contexts, and handles resize events.

**Returns:** `void`

---

#### `updateCanvasSize()`

Updates canvas dimensions to match container size and redraws overlays.

**Returns:** `void`

---

### Map Functions

#### `initializeMap()`

Initializes the Leaflet map with OpenStreetMap tiles.

**Returns:** `void`

---

#### `searchMap()`

Searches for a location and centers the map on it.

**Behavior:**
- Accepts coordinates in format: `"latitude,longitude"`
- Accepts location names (uses Nominatim geocoding API)
- Updates map view on success

**Returns:** `void`

---

#### `handleImageUpload(event)`

Handles image file upload for custom course imagery.

**Parameters:**
- `event` (Event): File input change event

**Returns:** `void`

---

#### `createBlankCanvas()`

Creates a blank canvas by removing all map layers and clearing drawings.

**Returns:** `void`

---

### Drawing Functions

#### `handleMouseDown(event)`

Handles mouse down events on the drawing canvas.

**Parameters:**
- `event` (MouseEvent): Mouse event object

**Behavior:**
- Initiates drawing for brush tool
- Starts measurement for measure tool
- Places stamp for stamp tool
- Creates annotation for annotate tool

**Returns:** `void`

---

#### `handleMouseMove(event)`

Handles mouse move events during drawing.

**Parameters:**
- `event` (MouseEvent): Mouse event object

**Behavior:**
- Draws brush strokes when brush tool is active

**Returns:** `void`

---

#### `handleMouseUp(event)`

Handles mouse up events to stop drawing.

**Parameters:**
- `event` (MouseEvent): Mouse event object

**Returns:** `void`

---

#### `drawStamp(x, y, stampType)`

Draws a stamp (emoji icon) at the specified coordinates.

**Parameters:**
- `x` (number): X coordinate on canvas
- `y` (number): Y coordinate on canvas
- `stampType` (string): Type of stamp ('tree', 'bush', 'hazard', 'bunker', 'water', 'flag')

**Returns:** `void`

---

#### `redraw()`

Redraws all overlay elements (measurements and annotations) on the overlay canvas.

**Returns:** `void`

---

### Measurement Functions

#### `calculateDistance(point1, point2)`

Calculates the distance between two points.

**Parameters:**
- `point1` (Object): First point `{ x: number, y: number }`
- `point2` (Object): Second point `{ x: number, y: number }`

**Returns:** `string` - Formatted distance with unit (e.g., "150.5 yards")

**Note:** Currently uses approximate conversion. Proper implementation would use map scale.

---

#### `updateMeasurementsList()`

Updates the measurements list display in the sidebar.

**Returns:** `void`

---

### File Operations

#### `newProject()`

Creates a new project, clearing all current work.

**Returns:** `void`

---

#### `loadProject()`

Loads a Birdie Book project from a `.birdie` file.

**Returns:** `Promise<void>`

---

#### `saveProject()`

Saves the current Birdie Book project to a `.birdie` file.

**Returns:** `Promise<void>`

---

### Print/Export Functions

#### `showPrintModal()`

Shows the print preview modal dialog.

**Returns:** `void`

---

#### `closePrintModal()`

Closes the print preview modal dialog.

**Returns:** `void`

---

#### `updatePrintPreview()`

Updates the print preview display with current paper size and orientation settings.

**Returns:** `void`

---

#### `exportToPDF()`

Exports the current canvas to a PDF file.

**Returns:** `Promise<void>`

**Supported Formats:**
- Paper sizes: A4, A5, A6
- Orientations: Portrait, Landscape

---

## External APIs

### OpenStreetMap Nominatim API

Used for geocoding location names to coordinates.

**Endpoint:** `https://nominatim.openstreetmap.org/search`

**Parameters:**
- `format`: `json`
- `q`: Location query string

**Example:**
```javascript
fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
```

---

### Leaflet.js API

The application uses Leaflet.js for map functionality. Refer to [Leaflet Documentation](https://leafletjs.com/reference.html) for detailed API information.

**Key Classes Used:**
- `L.Map` - Main map instance
- `L.TileLayer` - Map tile layers
- `L.imageOverlay` - Image overlays
- `L.control.zoom` - Zoom controls

---

## File Format Specification

### `.birdie` File Format

Birdie Book projects are saved as JSON files with the `.birdie` extension.

**Structure:**
```json
{
  "version": "1.0",
  "mapCenter": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "mapZoom": 15,
  "measurements": [
    {
      "start": { "x": 100, "y": 200 },
      "end": { "x": 300, "y": 400 },
      "distance": "150.5",
      "unit": "yards"
    }
  ],
  "annotations": [
    {
      "x": 250,
      "y": 300,
      "text": "Water hazard"
    }
  ],
  "brushColor": "#4CAF50",
  "brushThickness": 5,
  "canvasData": "data:image/png;base64,..."
}
```

---

## Error Handling

All IPC handlers return error information in the response object:

```javascript
{
  success: false,
  error: "Error message here"
}
```

File operations may also return a `canceled` flag if the user cancels the dialog:

```javascript
{
  success: false,
  canceled: true
}
```

---

## Version History

- **1.0** - Initial release with basic functionality
