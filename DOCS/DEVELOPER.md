# Developer Guide

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **Git** (for version control)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Birdie_Book_builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Or with developer tools:
```bash
npm run dev
```

## Project Structure

```
Birdie_Book_builder/
├── main.js              # Electron main process
├── index.html           # Application UI structure
├── app.js               # Application logic and state management
├── styles.css           # Application styles
├── package.json         # Project configuration and dependencies
├── README.md            # Project overview
├── LICENSE              # MIT License
├── .gitignore          # Git ignore rules
└── DOCS/               # Documentation
    ├── API.md          # API documentation
    ├── ARCHITECTURE.md # Architecture documentation
    ├── DEVELOPER.md    # This file
    ├── USER_MANUAL.md  # User manual
    ├── CONTRIBUTING.md # Contributing guidelines
    └── CHANGELOG.md    # Version history
```

## Development Workflow

### Running the Application

**Development Mode:**
```bash
npm start
```

**Development Mode with DevTools:**
```bash
npm run dev
```

This opens the Electron DevTools automatically for debugging.

### Building for Production

```bash
npm run build
```

This creates platform-specific distributables using `electron-builder`.

## Code Style Guidelines

### JavaScript Style

- Use **ES6+** features (arrow functions, const/let, template literals)
- Follow **camelCase** for variables and functions
- Use **PascalCase** for constructors/classes
- Use **UPPER_CASE** for constants
- Add **JSDoc comments** for all functions
- Use **2 spaces** for indentation

### Example:

```javascript
/**
 * Calculates the distance between two points.
 * @param {Object} point1 - First point
 * @param {Object} point2 - Second point
 * @returns {string} Formatted distance
 */
function calculateDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy).toFixed(2);
}
```

### CSS Style

- Use **kebab-case** for class names
- Follow **BEM** naming convention where appropriate
- Group related styles together
- Use meaningful class names

### HTML Style

- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Keep structure clean and organized

## Architecture Overview

### Main Process (`main.js`)

The main process handles:
- Window creation and management
- File system operations
- IPC communication handlers

**Key Functions:**
- `createWindow()` - Creates application window
- IPC handlers: `save-file`, `load-file`

### Renderer Process (`app.js`)

The renderer process handles:
- UI interactions
- Canvas operations
- Map integration
- State management

**Key Components:**
- State object (`state`)
- Canvas initialization
- Event handlers
- Tool management

## Adding New Features

### Adding a New Tool

1. **Add UI Element** (`index.html`):
```html
<button id="newToolBtn" class="tool-btn" data-tool="newtool">
  <span class="icon">🔧</span> New Tool
</button>
```

2. **Add Tool Handler** (`app.js`):
```javascript
function handleNewTool(x, y) {
  // Tool-specific logic
}

function handleMouseDown(e) {
  // ... existing code ...
  if (state.currentTool === 'newtool') {
    handleNewTool(x, y);
  }
}
```

3. **Update Tool Setup** (`app.js`):
```javascript
function setupToolButtons() {
  // ... existing code ...
  // Tool will be automatically handled by existing logic
}
```

4. **Add Tool Options Panel** (`index.html`):
```html
<div class="sidebar-section" id="newToolOptions" style="display: none;">
  <h3>New Tool Settings</h3>
  <!-- Tool-specific options -->
</div>
```

5. **Show/Hide Options** (`app.js`):
```javascript
document.getElementById('newToolOptions').style.display = 
  state.currentTool === 'newtool' ? 'block' : 'none';
```

### Adding a New Stamp

1. **Add to Emoji Map** (`app.js`):
```javascript
const emojiMap = {
  // ... existing stamps ...
  newstamp: '🆕'
};
```

2. **Add UI Element** (`index.html`):
```html
<div class="stamp-item" data-stamp="newstamp">🆕</div>
```

### Adding a New Export Format

1. **Add Export Function** (`app.js`):
```javascript
async function exportToNewFormat() {
  // Export logic
}
```

2. **Add UI Option** (`index.html`):
```html
<select id="exportFormat">
  <option value="pdf">PDF</option>
  <option value="newformat">New Format</option>
</select>
```

3. **Update Export Handler**:
```javascript
const format = document.getElementById('exportFormat').value;
if (format === 'newformat') {
  await exportToNewFormat();
}
```

## Debugging

### Main Process Debugging

Use `console.log()` in `main.js` - output appears in terminal.

### Renderer Process Debugging

1. **Open DevTools:**
   - Run `npm run dev` (auto-opens DevTools)
   - Or use `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)

2. **Console Logging:**
```javascript
console.log('Debug message', state);
console.error('Error message', error);
```

3. **Breakpoints:**
   - Set breakpoints in DevTools Sources panel
   - Use `debugger;` statement in code

### Common Debugging Scenarios

**Canvas Not Drawing:**
- Check canvas dimensions
- Verify context is initialized
- Check tool state

**Map Not Loading:**
- Check network connection
- Verify OpenStreetMap API access
- Check console for errors

**File Save/Load Issues:**
- Check IPC communication
- Verify file permissions
- Check JSON structure

## Testing

### Manual Testing Checklist

- [ ] Map import (search and upload)
- [ ] Drawing tools (brush, stamps)
- [ ] Measurement tool
- [ ] Annotations
- [ ] Save/Load functionality
- [ ] PDF export
- [ ] Layer visibility toggles
- [ ] Canvas resize handling

### Future: Automated Testing

Consider adding:
- Unit tests (Jest)
- Integration tests
- E2E tests (Spectron/Playwright)

## Performance Optimization

### Canvas Optimization

- Use `requestAnimationFrame` for animations
- Debounce resize events
- Optimize redraw frequency

### Memory Management

- Clear unused canvas data
- Limit canvas size for large images
- Implement image compression

### Map Performance

- Use appropriate zoom levels
- Limit tile loading
- Cache map views

## Common Issues and Solutions

### Issue: Canvas Drawing Not Working

**Solution:**
- Check if canvas is initialized
- Verify mouse event coordinates
- Check tool state

### Issue: Map Tiles Not Loading

**Solution:**
- Check internet connection
- Verify OpenStreetMap API access
- Check CORS settings

### Issue: File Save Fails

**Solution:**
- Check file permissions
- Verify JSON structure
- Check disk space

### Issue: PDF Export Fails

**Solution:**
- Check html2canvas library
- Verify canvas size
- Check memory usage

## Building and Distribution

### Building for Windows

```bash
npm run build -- --win
```

### Building for macOS

```bash
npm run build -- --mac
```

### Building for Linux

```bash
npm run build -- --linux
```

### Build Configuration

Edit `package.json` to configure `electron-builder`:

```json
{
  "build": {
    "appId": "com.birdiebook.builder",
    "productName": "Birdie Book Builder",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!node_modules/**/*"
    ]
  }
}
```

## Code Review Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] JSDoc comments added
- [ ] No console.log statements (except debugging)
- [ ] Error handling implemented
- [ ] Tested manually
- [ ] Documentation updated if needed

### Review Checklist

- Code quality
- Functionality
- Performance impact
- Security considerations
- Documentation completeness

## Resources

### Documentation

- [Electron Documentation](https://www.electronjs.org/docs)
- [Leaflet.js Documentation](https://leafletjs.com/reference.html)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [html2canvas Documentation](https://html2canvas.hertzen.com/)

### Tools

- [Electron DevTools](https://www.electronjs.org/docs/latest/tutorial/devtools)
- [VS Code Electron Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-js-debug)

## Getting Help

- Check existing documentation
- Review code comments
- Search GitHub issues
- Ask in discussions
- Review architecture documentation

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.
