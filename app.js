/**
 * @fileoverview Renderer process for Birdie Book Builder application.
 * Handles UI interactions, canvas drawing, map operations, and tool management.
 * @module app
 */

const { ipcRenderer } = require('electron');

/**
 * Application state object containing all current application data.
 * @typedef {Object} AppState
 * @property {string} currentTool - Currently selected tool ('brush', 'stamp', 'measure', 'annotate')
 * @property {string|null} selectedStamp - Currently selected stamp type
 * @property {L.Map|null} map - Leaflet map instance
 * @property {HTMLCanvasElement|null} drawCanvas - Canvas element for drawings
 * @property {HTMLCanvasElement|null} overlayCanvas - Canvas element for overlays (measurements, annotations)
 * @property {CanvasRenderingContext2D|null} drawContext - Drawing context for drawCanvas
 * @property {CanvasRenderingContext2D|null} overlayContext - Drawing context for overlayCanvas
 * @property {boolean} isDrawing - Whether user is currently drawing
 * @property {number} lastX - Last X coordinate for drawing
 * @property {number} lastY - Last Y coordinate for drawing
 * @property {string} brushColor - Current brush color (hex format)
 * @property {number} brushThickness - Current brush thickness in pixels
 * @property {Array<Object>} measurements - Array of measurement objects
 * @property {Array<Object>} annotations - Array of annotation objects
 * @property {Object|null} currentMeasurement - Current measurement in progress
 * @property {string} measureUnit - Measurement unit ('yards' or 'meters')
 * @property {Object} layers - Layer visibility settings
 * @property {boolean} layers.map - Map layer visibility
 * @property {boolean} layers.drawings - Drawings layer visibility
 * @property {boolean} layers.measurements - Measurements layer visibility
 * @property {boolean} layers.annotations - Annotations layer visibility
 */

/**
 * Application state object.
 * @type {AppState}
 */
let state = {
    currentTool: 'pan', // Default to pan tool for map navigation
    selectedStamp: null,
    map: null,
    drawCanvas: null,
    overlayCanvas: null,
    drawContext: null,
    overlayContext: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    brushColor: '#2d5016', // Default to fairway color
    brushThickness: 5,
    measurements: [],
    annotations: [],
    currentMeasurement: null,
    measureUnit: 'yards',
    layers: {
        map: true,
        drawings: true,
        measurements: true,
        annotations: true
    },
    // Fill tool state
    currentPolygon: null, // Current polygon being drawn
    filledAreas: [], // Array of filled ground type areas
    selectedGroundType: 'fairway', // Currently selected ground type
    // Undo/Redo history
    history: {
        drawings: [], // Array of canvas states (image data)
        measurements: [],
        annotations: [],
        filledAreas: [],
        currentIndex: -1
    }
};

/**
 * Initializes the application when DOM is loaded.
 * Sets up canvas, map, event listeners, and tool buttons.
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    initializeMap();
    setupEventListeners();
    setupToolButtons();
    
    // Set default fairway selection after a short delay to ensure DOM is ready
    setTimeout(() => {
        const fairwayItem = document.querySelector('.ground-type-item[data-type="fairway"]');
        if (fairwayItem) {
            fairwayItem.classList.add('selected');
        }
    }, 100);
});

/**
 * Initializes the drawing and overlay canvases.
 * Sets up canvas contexts and handles window resize events.
 * @function initializeCanvas
 */
function initializeCanvas() {
    state.drawCanvas = document.getElementById('drawCanvas');
    state.overlayCanvas = document.getElementById('overlayCanvas');
    state.drawContext = state.drawCanvas.getContext('2d');
    state.overlayContext = state.overlayCanvas.getContext('2d');

    // Initialize canvas pointer-events (starts as none for pan tool)
    state.drawCanvas.style.pointerEvents = 'none';

    // Set canvas size
    function resizeCanvas() {
        const container = document.getElementById('mapContainer');
        state.drawCanvas.width = container.offsetWidth;
        state.drawCanvas.height = container.offsetHeight;
        state.overlayCanvas.width = container.offsetWidth;
        state.overlayCanvas.height = container.offsetHeight;
        // Save initial state to history
        saveStateToHistory();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize history with empty state (after a short delay to ensure canvas is ready)
    setTimeout(() => {
        saveStateToHistory();
        updateUndoRedoButtons();
    }, 100);
}

/**
 * Initializes the Leaflet map with satellite imagery tile layer.
 * Uses Esri World Imagery for real satellite photos (compatible with Electron, no referer required).
 * Sets up default view, zoom controls, and map event handlers.
 * @function initializeMap
 */
function initializeMap() {
    // Initialize Leaflet map
    state.map = L.map('map', {
        center: [40.7128, -74.0060], // Default to NYC
        zoom: 15,
        zoomControl: false
    });

    // Add satellite imagery tile layer - Using Esri World Imagery
    // Provides real satellite/aerial imagery, works with Electron, no API key required
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
        maxZoom: 19
    }).addTo(state.map);

    // Add zoom controls
    L.control.zoom({
        position: 'topright'
    }).addTo(state.map);

    // Update canvas size when map moves
    state.map.on('moveend', () => {
        updateCanvasSize();
    });

    // Prevent map from capturing events when tools are active
    // We'll handle this in tool selection, but also add a general handler
    state.map.getContainer().style.pointerEvents = 'auto';
}

/**
 * Updates canvas dimensions to match container size and redraws overlays.
 * Called when map view changes or window is resized.
 * @function updateCanvasSize
 */
function updateCanvasSize() {
    const container = document.getElementById('mapContainer');
    state.drawCanvas.width = container.offsetWidth;
    state.drawCanvas.height = container.offsetHeight;
    state.overlayCanvas.width = container.offsetWidth;
    state.overlayCanvas.height = container.offsetHeight;
    redraw();
}

/**
 * Sets up all event listeners for UI interactions.
 * Handles file operations, map controls, tool settings, and canvas events.
 * @function setupEventListeners
 */
function setupEventListeners() {
    // File operations
    document.getElementById('newBtn').addEventListener('click', newProject);
    document.getElementById('loadBtn').addEventListener('click', loadProject);
    document.getElementById('saveBtn').addEventListener('click', saveProject);
    document.getElementById('printBtn').addEventListener('click', showPrintModal);

    // Map import
    document.getElementById('searchMapBtn').addEventListener('click', searchMap);
    document.getElementById('uploadImageBtn').addEventListener('click', () => {
        document.getElementById('imageUpload').click();
    });
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    document.getElementById('blankCanvasBtn').addEventListener('click', createBlankCanvas);

    // Canvas controls
    document.getElementById('zoomInBtn').addEventListener('click', () => state.map.zoomIn());
    document.getElementById('zoomOutBtn').addEventListener('click', () => state.map.zoomOut());
    document.getElementById('resetViewBtn').addEventListener('click', () => {
        state.map.setView([40.7128, -74.0060], 15);
    });

    // Brush settings
    document.getElementById('brushColor').addEventListener('change', (e) => {
        state.brushColor = e.target.value;
    });
    document.getElementById('brushThickness').addEventListener('input', (e) => {
        state.brushThickness = parseInt(e.target.value);
        document.getElementById('thicknessValue').textContent = e.target.value;
    });

    // Ground type selection
    document.querySelectorAll('.ground-type-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all items
            document.querySelectorAll('.ground-type-item').forEach(i => i.classList.remove('selected'));
            // Add active class to clicked item
            item.classList.add('selected');
            // Set selected ground type
            state.selectedGroundType = item.dataset.type;
            const color = item.dataset.color;
            state.brushColor = color;
        });
    });

    // Measurement unit
    document.getElementById('measureUnit').addEventListener('change', (e) => {
        state.measureUnit = e.target.value;
    });

    // Layer toggles
    document.querySelectorAll('#layersList input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const layerName = e.target.id.replace('layer-', '');
            state.layers[layerName] = e.target.checked;
            redraw();
        });
    });

    // Drawing canvas events - only attach if canvas exists
    if (state.drawCanvas) {
        // Use capture phase to ensure we get events before map
        state.drawCanvas.addEventListener('mousedown', handleMouseDown, true);
        state.drawCanvas.addEventListener('mousemove', handleMouseMove, true);
        state.drawCanvas.addEventListener('mouseup', handleMouseUp, true);
        state.drawCanvas.addEventListener('mouseleave', handleMouseUp, true);
        state.drawCanvas.addEventListener('dblclick', handleDoubleClick, true);
        
        // Also add a test click handler to verify events are working
        state.drawCanvas.addEventListener('click', (e) => {
            if (state.currentTool !== 'pan') {
                console.log('Canvas click received!', state.currentTool);
            }
        }, true);
    } else {
        console.error('drawCanvas not found when setting up event listeners');
    }

    // Print modal
    document.getElementById('closePrintModal').addEventListener('click', closePrintModal);
    document.getElementById('cancelPrintBtn').addEventListener('click', closePrintModal);
    document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
    document.getElementById('paperSize').addEventListener('change', updatePrintPreview);
    document.getElementById('paperOrientation').addEventListener('change', updatePrintPreview);
}

/**
 * Sets up tool button event listeners and manages tool selection UI.
 * Shows/hides tool-specific options panels based on selected tool.
 * @function setupToolButtons
 */
function setupToolButtons() {
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentTool = btn.dataset.tool;

            // Update canvas pointer-events based on tool
            // Only capture events when a drawing tool is active (not pan)
            if (state.drawCanvas && state.overlayCanvas) {
                if (state.currentTool === 'pan') {
                    state.drawCanvas.style.pointerEvents = 'none';
                    state.overlayCanvas.style.pointerEvents = 'none';
                    state.drawCanvas.style.cursor = 'grab';
                    // Enable map dragging for pan tool
                    if (state.map) {
                        state.map.dragging.enable();
                        state.map.scrollWheelZoom.enable();
                        state.map.doubleClickZoom.enable();
                        state.map.boxZoom.enable();
                        state.map.keyboard.enable();
                        state.map.touchZoom.enable();
                        // Re-enable map container pointer events
                        const mapContainer = state.map.getContainer();
                        if (mapContainer) {
                            mapContainer.style.pointerEvents = 'auto';
                        }
                    }
                } else {
                    state.drawCanvas.style.pointerEvents = 'auto';
                    state.overlayCanvas.style.pointerEvents = 'none'; // Overlay should never capture events
                    state.drawCanvas.style.cursor = 'crosshair';
                    // Disable map dragging and interactions when using tools
                    if (state.map) {
                        state.map.dragging.disable();
                        state.map.scrollWheelZoom.disable();
                        state.map.doubleClickZoom.disable();
                        state.map.boxZoom.disable();
                        state.map.keyboard.disable();
                        state.map.touchZoom.disable();
                        // Make map container not capture pointer events
                        const mapContainer = state.map.getContainer();
                        if (mapContainer) {
                            mapContainer.style.pointerEvents = 'none';
                        }
                    }
                    console.log('Tool selected:', state.currentTool, 'pointer-events set to auto, all map interactions disabled');
                }
            } else {
                console.error('Canvas not available when selecting tool', {
                    drawCanvas: !!state.drawCanvas,
                    overlayCanvas: !!state.overlayCanvas
                });
            }

            // Show/hide tool options
            document.getElementById('fillOptions').style.display = 
                state.currentTool === 'fill' ? 'block' : 'none';
            document.getElementById('stampOptions').style.display = 
                state.currentTool === 'stamp' ? 'block' : 'none';
            document.getElementById('measureOptions').style.display = 
                state.currentTool === 'measure' ? 'block' : 'none';

            // Set default ground type selection when fill tool is selected
            if (state.currentTool === 'fill') {
                const fairwayItem = document.querySelector('.ground-type-item[data-type="fairway"]');
                if (fairwayItem && !document.querySelector('.ground-type-item.selected')) {
                    fairwayItem.classList.add('selected');
                    state.selectedGroundType = 'fairway';
                }
            }


            // Setup stamp selection
            if (state.currentTool === 'stamp') {
                document.querySelectorAll('.stamp-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        document.querySelectorAll('.stamp-item').forEach(i => i.classList.remove('selected'));
                        item.classList.add('selected');
                        state.selectedStamp = item.dataset.stamp;
                    });
                });
            }
        });
    });

    // Undo/Redo buttons
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            redo();
        }
    });
}

/**
 * Handles mouse down events on the drawing canvas.
 * Initiates drawing, measurement, stamp placement, or annotation based on current tool.
 * @param {MouseEvent} e - Mouse event object
 * @function handleMouseDown
 */
function handleMouseDown(e) {
    // Only process if not pan tool
    if (state.currentTool === 'pan') {
        return;
    }
    
    // Prevent map interaction - stop all event propagation
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    if (!state.drawCanvas) {
        console.error('drawCanvas not available in handleMouseDown');
        return;
    }
    
    const rect = state.drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log('Mouse down on canvas:', state.currentTool, x, y, 'Event type:', e.type);

    if (state.currentTool === 'fill') {
        // Start or continue polygon drawing
        if (!state.currentPolygon) {
            state.currentPolygon = { points: [{ x, y }], groundType: state.selectedGroundType };
            saveStateToHistory();
        } else {
            state.currentPolygon.points.push({ x, y });
        }
        redraw();
    } else if (state.currentTool === 'measure') {
        if (!state.currentMeasurement) {
            state.currentMeasurement = { start: { x, y }, end: null };
        } else {
            state.currentMeasurement.end = { x, y };
            const distance = calculateDistance(
                state.currentMeasurement.start,
                state.currentMeasurement.end
            );
            state.measurements.push({
                ...state.currentMeasurement,
                distance,
                unit: state.measureUnit
            });
            state.currentMeasurement = null;
            updateMeasurementsList();
            redraw();
            saveStateToHistory(); // Save after measurement complete
        }
    } else if (state.currentTool === 'stamp') {
        if (!state.selectedStamp) {
            alert('Please select a stamp first from the sidebar');
            return;
        }
        saveStateToHistory(); // Save before stamp
        drawStamp(x, y, state.selectedStamp);
    } else if (state.currentTool === 'annotate') {
        const note = prompt('Enter annotation:');
        if (note) {
            saveStateToHistory(); // Save before annotation
            state.annotations.push({ x, y, text: note });
            redraw();
        }
    }
}

function handleDoubleClick(e) {
    if (state.currentTool === 'fill' && state.currentPolygon && state.currentPolygon.points.length >= 3) {
        // Close polygon and fill
        fillPolygon(state.currentPolygon);
        state.filledAreas.push(state.currentPolygon);
        state.currentPolygon = null;
        redraw();
        saveStateToHistory();
    }
}

/**
 * Handles mouse move events during drawing.
 * Draws brush strokes when brush tool is active and user is drawing.
 * @param {MouseEvent} e - Mouse event object
 * @function handleMouseMove
 */
function handleMouseMove(e) {
    const rect = state.drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update preview for fill tool
    if (state.currentTool === 'fill' && state.currentPolygon) {
        redraw();
        // Draw preview line to current mouse position
        state.overlayContext.strokeStyle = '#FF0000';
        state.overlayContext.lineWidth = 2;
        state.overlayContext.setLineDash([5, 5]);
        state.overlayContext.beginPath();
        const lastPoint = state.currentPolygon.points[state.currentPolygon.points.length - 1];
        state.overlayContext.moveTo(lastPoint.x, lastPoint.y);
        state.overlayContext.lineTo(x, y);
        state.overlayContext.stroke();
        state.overlayContext.setLineDash([]);
    }
}

/**
 * Handles mouse up events to stop drawing.
 * @param {MouseEvent} e - Mouse event object
 * @function handleMouseUp
 */
function handleMouseUp(e) {
    if (state.isDrawing && state.currentTool === 'brush') {
        // Save state after drawing stroke completes
        saveStateToHistory();
    }
    state.isDrawing = false;
}

/**
 * Draws a stamp (emoji icon) at the specified coordinates.
 * @param {number} x - X coordinate on canvas
 * @param {number} y - Y coordinate on canvas
 * @param {string} stampType - Type of stamp ('tree', 'bush', 'hazard', 'bunker', 'water', 'flag')
 * @function drawStamp
 */
function drawStamp(x, y, stampType) {
    const emojiMap = {
        tree: '🌲',
        bush: '🌿',
        hazard: '⚠️',
        bunker: '🏖️',
        water: '💧',
        flag: '🚩'
    };

    state.drawContext.font = '32px Arial';
    state.drawContext.textAlign = 'center';
    state.drawContext.textBaseline = 'middle';
    state.drawContext.fillText(emojiMap[stampType] || '📍', x, y);
}

/**
 * Calculates the distance between two points on the map.
 * Converts pixel distance to real-world units using proper map scale calculation.
 * @param {Object} point1 - First point with x and y coordinates
 * @param {number} point1.x - X coordinate
 * @param {number} point1.y - Y coordinate
 * @param {Object} point2 - Second point with x and y coordinates
 * @param {number} point2.x - X coordinate
 * @param {number} point2.y - Y coordinate
 * @returns {string} Distance as a formatted string with unit
 * @function calculateDistance
 */
function calculateDistance(point1, point2) {
    if (!state.map) return '0';
    
    // Get map center for latitude calculation
    const center = state.map.getCenter();
    const lat = center.lat;
    const zoom = state.map.getZoom();
    
    // Calculate pixel distance
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const pixels = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate meters per pixel based on zoom level and latitude
    // Formula: metersPerPixel = (156543.03392 * cos(lat)) / (2^zoom)
    // This is the standard Web Mercator projection calculation
    const metersPerPixel = (156543.03392 * Math.cos(lat * Math.PI / 180)) / Math.pow(2, zoom);
    
    // Convert pixels to meters
    const meters = pixels * metersPerPixel;
    
    // Convert to requested unit
    if (state.measureUnit === 'yards') {
        return (meters * 1.09361).toFixed(1);
    }
    return meters.toFixed(1);
}

/**
 * Updates the measurements list display in the sidebar.
 * Renders all saved measurements with their distances and units.
 * @function updateMeasurementsList
 */
function updateMeasurementsList() {
    const list = document.getElementById('measurementsList');
    list.innerHTML = state.measurements.map((m, i) => 
        `<div class="measurement-item">${i + 1}: ${m.distance} ${m.unit}</div>`
    ).join('');
}

/**
 * Fills a polygon with the selected ground type and appropriate texture.
 * @param {Object} polygon - Polygon object with points and groundType
 * @function fillPolygon
 */
function fillPolygon(polygon) {
    if (polygon.points.length < 3) return;

    const ctx = state.drawContext;
    const groundType = polygon.groundType;
    
    // Get color for ground type
    const colors = {
        fairway: '#2d5016',
        green: '#4a7c2a',
        rough: '#5a6b3a',
        bunker: '#d4c5a9',
        water: '#4a90e2',
        path: '#8b7355'
    };
    
    const color = colors[groundType] || colors.fairway;
    
    // Draw filled polygon
    ctx.beginPath();
    ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
    for (let i = 1; i < polygon.points.length; i++) {
        ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    
    // Add texture based on ground type
    addTexture(ctx, polygon, groundType);
    
    // Draw outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
}

/**
 * Adds texture pattern to filled area based on ground type.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} polygon - Polygon object
 * @param {string} groundType - Type of ground
 * @function addTexture
 */
function addTexture(ctx, polygon, groundType) {
    ctx.save();
    
    // Create clipping path
    ctx.beginPath();
    ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
    for (let i = 1; i < polygon.points.length; i++) {
        ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
    }
    ctx.closePath();
    ctx.clip();
    
    if (groundType === 'fairway') {
        // Horizontal stripes for fairway
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        const minY = Math.min(...polygon.points.map(p => p.y));
        const maxY = Math.max(...polygon.points.map(p => p.y));
        for (let y = minY; y <= maxY; y += 8) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(state.drawCanvas.width, y);
            ctx.stroke();
        }
    } else if (groundType === 'green') {
        // Smooth texture - subtle dots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        const minX = Math.min(...polygon.points.map(p => p.x));
        const maxX = Math.max(...polygon.points.map(p => p.x));
        const minY = Math.min(...polygon.points.map(p => p.y));
        const maxY = Math.max(...polygon.points.map(p => p.y));
        for (let x = minX; x <= maxX; x += 6) {
            for (let y = minY; y <= maxY; y += 6) {
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (groundType === 'rough') {
        // Random texture for rough
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 1;
        const minX = Math.min(...polygon.points.map(p => p.x));
        const maxX = Math.max(...polygon.points.map(p => p.x));
        const minY = Math.min(...polygon.points.map(p => p.y));
        const maxY = Math.max(...polygon.points.map(p => p.y));
        for (let i = 0; i < 50; i++) {
            const x1 = minX + Math.random() * (maxX - minX);
            const y1 = minY + Math.random() * (maxY - minY);
            const x2 = x1 + (Math.random() - 0.5) * 10;
            const y2 = y1 + (Math.random() - 0.5) * 10;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    } else if (groundType === 'bunker') {
        // Sand texture - dots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        const minX = Math.min(...polygon.points.map(p => p.x));
        const maxX = Math.max(...polygon.points.map(p => p.x));
        const minY = Math.min(...polygon.points.map(p => p.y));
        const maxY = Math.max(...polygon.points.map(p => p.y));
        for (let i = 0; i < 100; i++) {
            const x = minX + Math.random() * (maxX - minX);
            const y = minY + Math.random() * (maxY - minY);
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (groundType === 'water') {
        // Water texture - wavy lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        const minY = Math.min(...polygon.points.map(p => p.y));
        const maxY = Math.max(...polygon.points.map(p => p.y));
        for (let y = minY; y <= maxY; y += 4) {
            ctx.beginPath();
            const minX = Math.min(...polygon.points.map(p => p.x));
            const maxX = Math.max(...polygon.points.map(p => p.x));
            ctx.moveTo(minX, y);
            for (let x = minX; x <= maxX; x += 5) {
                ctx.lineTo(x, y + Math.sin(x / 10) * 2);
            }
            ctx.stroke();
        }
    }
    
    ctx.restore();
}

/**
 * Redraws all overlay elements (measurements and annotations) on the overlay canvas.
 * Respects layer visibility settings from state.layers.
 * @function redraw
 */
function redraw() {
    // Redraw filled areas on main canvas
    if (state.layers.drawings) {
        state.drawContext.clearRect(0, 0, state.drawCanvas.width, state.drawCanvas.height);
        state.filledAreas.forEach(polygon => {
            fillPolygon(polygon);
        });
    }

    // Clear overlay canvas
    state.overlayContext.clearRect(0, 0, state.overlayCanvas.width, state.overlayCanvas.height);

    // Draw current polygon being drawn
    if (state.currentPolygon && state.currentPolygon.points.length > 0) {
        state.overlayContext.strokeStyle = '#FF0000';
        state.overlayContext.lineWidth = 2;
        state.overlayContext.beginPath();
        state.overlayContext.moveTo(state.currentPolygon.points[0].x, state.currentPolygon.points[0].y);
        for (let i = 1; i < state.currentPolygon.points.length; i++) {
            state.overlayContext.lineTo(state.currentPolygon.points[i].x, state.currentPolygon.points[i].y);
        }
        state.overlayContext.stroke();
        
        // Draw points
        state.overlayContext.fillStyle = '#FF0000';
        state.currentPolygon.points.forEach(point => {
            state.overlayContext.beginPath();
            state.overlayContext.arc(point.x, point.y, 4, 0, Math.PI * 2);
            state.overlayContext.fill();
        });
    }

    // Draw measurements
    if (state.layers.measurements) {
        state.measurements.forEach(m => {
            state.overlayContext.strokeStyle = '#FF0000';
            state.overlayContext.lineWidth = 2;
            state.overlayContext.beginPath();
            state.overlayContext.moveTo(m.start.x, m.start.y);
            state.overlayContext.lineTo(m.end.x, m.end.y);
            state.overlayContext.stroke();

            // Draw distance label
            const midX = (m.start.x + m.end.x) / 2;
            const midY = (m.start.y + m.end.y) / 2;
            state.overlayContext.fillStyle = '#FF0000';
            state.overlayContext.font = '12px Arial';
            state.overlayContext.fillText(`${m.distance} ${m.unit}`, midX, midY - 5);
        });

        // Draw current measurement in progress
        if (state.currentMeasurement && state.currentMeasurement.start) {
            state.overlayContext.strokeStyle = '#FF0000';
            state.overlayContext.lineWidth = 2;
            state.overlayContext.setLineDash([5, 5]);
            state.overlayContext.beginPath();
            state.overlayContext.moveTo(state.currentMeasurement.start.x, state.currentMeasurement.start.y);
            const rect = state.drawCanvas.getBoundingClientRect();
            state.overlayContext.lineTo(rect.width / 2, rect.height / 2);
            state.overlayContext.stroke();
            state.overlayContext.setLineDash([]);
        }
    }

    // Draw annotations
    if (state.layers.annotations) {
        state.annotations.forEach(ann => {
            state.overlayContext.fillStyle = '#0000FF';
            state.overlayContext.font = '14px Arial';
            state.overlayContext.fillText(ann.text, ann.x, ann.y);
        });
    }
}

/**
 * Searches for a location and centers the map on it.
 * Accepts coordinates (lat,lon) or location name (uses Nominatim geocoding).
 * @function searchMap
 */
function searchMap() {
    const query = document.getElementById('courseName').value;
    if (!query) return;

    // Try to parse as coordinates
    const coordMatch = query.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lon = parseFloat(coordMatch[2]);
        state.map.setView([lat, lon], 15);
        return;
    }

    // Use Nominatim for geocoding
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const result = data[0];
                state.map.setView([parseFloat(result.lat), parseFloat(result.lon)], 15);
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error searching location:', error);
            alert('Error searching location');
        });
}

/**
 * Handles image file upload for custom course imagery.
 * Replaces map tiles with the uploaded image as an overlay.
 * @param {Event} e - File input change event
 * @function handleImageUpload
 */
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Remove existing map layers
            state.map.eachLayer(layer => {
                if (layer instanceof L.TileLayer) {
                    state.map.removeLayer(layer);
                }
            });

            // Add image overlay
            const bounds = [[0, 0], [img.height, img.width]];
            L.imageOverlay(event.target.result, bounds).addTo(state.map);
            state.map.fitBounds(bounds);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * Creates a blank canvas by removing all map layers and clearing drawings.
 * Resets measurements and annotations arrays.
 * @function createBlankCanvas
 */
function createBlankCanvas() {
    // Remove map layers
    state.map.eachLayer(layer => {
        state.map.removeLayer(layer);
    });

    // Clear drawings
    state.drawContext.clearRect(0, 0, state.drawCanvas.width, state.drawCanvas.height);
    state.overlayContext.clearRect(0, 0, state.overlayCanvas.width, state.overlayCanvas.height);
    state.measurements = [];
    state.annotations = [];
    state.filledAreas = [];
    state.currentPolygon = null;
    updateMeasurementsList();
}

/**
 * Creates a new project, clearing all current work.
 * Prompts user for confirmation before proceeding.
 * @function newProject
 */
function newProject() {
    if (confirm('Create a new project? Unsaved changes will be lost.')) {
        createBlankCanvas();
        state.map.setView([40.7128, -74.0060], 15);
    }
}

/**
 * Loads a Birdie Book project from a .birdie file.
 * Restores map view, measurements, annotations, and drawing settings.
 * @returns {Promise<void>}
 * @async
 * @function loadProject
 */
async function loadProject() {
    const result = await ipcRenderer.invoke('load-file');
    if (result.success) {
        try {
            const data = result.data;
            // Restore state
            if (data.measurements) state.measurements = data.measurements;
            if (data.annotations) state.annotations = data.annotations;
            if (data.filledAreas) state.filledAreas = data.filledAreas;
            if (data.brushColor) state.brushColor = data.brushColor;
            if (data.brushThickness) state.brushThickness = data.brushThickness;
            
            // Restore map view if coordinates provided
            if (data.mapCenter && data.mapZoom) {
                state.map.setView(data.mapCenter, data.mapZoom);
            }

            // Redraw
            redraw();
            updateMeasurementsList();
            alert('Project loaded successfully');
        } catch (error) {
            alert('Error loading project: ' + error.message);
        }
    }
}

/**
 * Saves the current Birdie Book project to a .birdie file.
 * Includes map state, measurements, annotations, brush settings, and canvas data.
 * @returns {Promise<void>}
 * @async
 * @function saveProject
 */
async function saveProject() {
    const data = {
        version: '1.0',
        mapCenter: state.map.getCenter(),
        mapZoom: state.map.getZoom(),
        measurements: state.measurements,
        annotations: state.annotations,
        filledAreas: state.filledAreas,
        brushColor: state.brushColor,
        brushThickness: state.brushThickness,
        canvasData: state.drawCanvas.toDataURL()
    };

    const result = await ipcRenderer.invoke('save-file', data);
    if (result.success) {
        alert('Project saved successfully');
    } else if (!result.canceled) {
        alert('Error saving project: ' + result.error);
    }
}

/**
 * Shows the print preview modal dialog.
 * @function showPrintModal
 */
function showPrintModal() {
    document.getElementById('printModal').classList.add('active');
    updatePrintPreview();
}

/**
 * Closes the print preview modal dialog.
 * @function closePrintModal
 */
function closePrintModal() {
    document.getElementById('printModal').classList.remove('active');
}

/**
 * Updates the print preview display with current paper size and orientation settings.
 * @function updatePrintPreview
 */
function updatePrintPreview() {
    const preview = document.getElementById('printPreview');
    const paperSize = document.getElementById('paperSize').value;
    const orientation = document.getElementById('paperOrientation').value;
    
    // Create preview content
    preview.innerHTML = `
        <div style="border: 2px dashed #ccc; padding: 20px; text-align: center;">
            <h3>Print Preview - ${paperSize} (${orientation})</h3>
            <p>This will export the current canvas with all visible layers.</p>
            <p>Paper size: ${paperSize}</p>
            <p>Orientation: ${orientation}</p>
        </div>
    `;
}

/**
 * Saves current state to history for undo/redo functionality.
 * @function saveStateToHistory
 */
function saveStateToHistory() {
    // Remove any states after current index (when undoing then doing new action)
    if (state.history.currentIndex < state.history.drawings.length - 1) {
        state.history.drawings = state.history.drawings.slice(0, state.history.currentIndex + 1);
        state.history.measurements = state.history.measurements.slice(0, state.history.currentIndex + 1);
        state.history.annotations = state.history.annotations.slice(0, state.history.currentIndex + 1);
        state.history.filledAreas = state.history.filledAreas.slice(0, state.history.currentIndex + 1);
    }

    // Save current state
    state.history.drawings.push(state.drawCanvas.toDataURL());
    state.history.measurements.push(JSON.parse(JSON.stringify(state.measurements)));
    state.history.annotations.push(JSON.parse(JSON.stringify(state.annotations)));
    state.history.filledAreas.push(JSON.parse(JSON.stringify(state.filledAreas)));
    
    // Limit history to 50 states to prevent memory issues
    const maxHistory = 50;
    if (state.history.drawings.length > maxHistory) {
        state.history.drawings.shift();
        state.history.measurements.shift();
        state.history.annotations.shift();
    } else {
        state.history.currentIndex++;
    }

    updateUndoRedoButtons();
}

/**
 * Restores state from history at given index.
 * @param {number} index - History index to restore
 * @function restoreStateFromHistory
 */
function restoreStateFromHistory(index) {
    if (index < 0 || index >= state.history.drawings.length) return;

    // Restore canvas
    const img = new Image();
    img.onload = () => {
        state.drawContext.clearRect(0, 0, state.drawCanvas.width, state.drawCanvas.height);
        state.drawContext.drawImage(img, 0, 0);
    };
    img.src = state.history.drawings[index];

    // Restore measurements, annotations, and filled areas
    state.measurements = JSON.parse(JSON.stringify(state.history.measurements[index]));
    state.annotations = JSON.parse(JSON.stringify(state.history.annotations[index]));
    if (state.history.filledAreas[index]) {
        state.filledAreas = JSON.parse(JSON.stringify(state.history.filledAreas[index]));
    }

    state.history.currentIndex = index;
    updateMeasurementsList();
    redraw();
    updateUndoRedoButtons();
}

/**
 * Undoes the last action.
 * @function undo
 */
function undo() {
    if (state.history.currentIndex > 0) {
        restoreStateFromHistory(state.history.currentIndex - 1);
    }
}

/**
 * Redoes the last undone action.
 * @function redo
 */
function redo() {
    if (state.history.currentIndex < state.history.drawings.length - 1) {
        restoreStateFromHistory(state.history.currentIndex + 1);
    }
}

/**
 * Updates undo/redo button states based on history availability.
 * @function updateUndoRedoButtons
 */
function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    
    undoBtn.disabled = state.history.currentIndex <= 0;
    redoBtn.disabled = state.history.currentIndex >= state.history.drawings.length - 1;
    
    undoBtn.style.opacity = undoBtn.disabled ? '0.5' : '1';
    redoBtn.style.opacity = redoBtn.disabled ? '0.5' : '1';
}

/**
 * Exports the current canvas to a PDF file.
 * Uses html2canvas to capture the map container and jsPDF to generate the PDF.
 * Supports A4, A5, and A6 paper sizes with portrait or landscape orientation.
 * @returns {Promise<void>}
 * @async
 * @function exportToPDF
 */
async function exportToPDF() {
    const paperSize = document.getElementById('paperSize').value;
    let orientation = document.getElementById('paperOrientation').value;

    // Force portrait orientation for Birdie Books (tee bottom, green top)
    // Portrait is standard for golf course layouts
    orientation = 'portrait';

    // Get paper dimensions in mm
    const sizes = {
        A4: { width: 210, height: 297 },
        A5: { width: 148, height: 210 },
        A6: { width: 105, height: 148 }
    };

    let width = sizes[paperSize].width;
    let height = sizes[paperSize].height;

    // Use html2canvas to capture the canvas area
    const container = document.getElementById('mapContainer');
    
    try {
        const canvas = await html2canvas(container, {
            backgroundColor: '#ffffff',
            scale: 2
        });

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: paperSize.toLowerCase()
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = width;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Center the image
        const xOffset = 0;
        const yOffset = (height - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        pdf.save('birdie-book.pdf');

        alert('PDF exported successfully!');
        closePrintModal();
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Error exporting PDF: ' + error.message);
    }
}
