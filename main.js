/**
 * @fileoverview Main process for Birdie Book Builder Electron application.
 * Handles window creation, file operations, and IPC communication.
 * @module main
 */

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

/** @type {BrowserWindow|null} Main application window */
let mainWindow;

/**
 * Creates and configures the main application window.
 * Sets up window properties, loads the HTML file, and handles window events.
 * @function createWindow
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * IPC handler for saving Birdie Book project files.
 * Opens a save dialog and writes the project data to a .birdie file.
 * @param {Electron.IpcMainInvokeEvent} event - IPC event object
 * @param {Object} data - Project data to save (measurements, annotations, canvas, etc.)
 * @returns {Promise<{success: boolean, path?: string, error?: string, canceled?: boolean}>}
 *          Result object with success status, file path, error message, or canceled flag
 * @async
 */
ipcMain.handle('save-file', async (event, data) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Birdie Book',
    defaultPath: 'course.birdie',
    filters: [
      { name: 'Birdie Book Files', extensions: ['birdie'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!canceled && filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { success: true, path: filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return { success: false, canceled: true };
});

/**
 * IPC handler for loading Birdie Book project files.
 * Opens a file dialog and reads/parses the selected .birdie file.
 * @returns {Promise<{success: boolean, data?: Object, path?: string, error?: string, canceled?: boolean}>}
 *          Result object with success status, parsed data, file path, error message, or canceled flag
 * @async
 */
ipcMain.handle('load-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Birdie Book',
    filters: [
      { name: 'Birdie Book Files', extensions: ['birdie'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (!canceled && filePaths && filePaths.length > 0) {
    try {
      const data = fs.readFileSync(filePaths[0], 'utf8');
      return { success: true, data: JSON.parse(data), path: filePaths[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return { success: false, canceled: true };
});
