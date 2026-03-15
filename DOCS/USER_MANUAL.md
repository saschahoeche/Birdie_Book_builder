# User Manual

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Features](#features)
5. [Creating a Birdie Book](#creating-a-birdie-book)
6. [Tools Reference](#tools-reference)
7. [Saving and Loading](#saving-and-loading)
8. [Printing and Exporting](#printing-and-exporting)
9. [Tips and Tricks](#tips-and-tricks)
10. [Troubleshooting](#troubleshooting)

## Introduction

Birdie Book Builder is a desktop application that allows golfers to create personalized Birdie Books for golf courses. You can import satellite imagery, draw on courses, measure distances, add annotations, and export your work as a PDF.

## Installation

### System Requirements

- **Windows:** Windows 10 or later
- **macOS:** macOS 10.13 or later
- **Linux:** Most modern distributions

### Installing the Application

1. Download the installer for your platform from the releases page
2. Run the installer
3. Follow the installation wizard
4. Launch Birdie Book Builder from your applications menu

## Getting Started

### First Launch

When you first launch Birdie Book Builder, you'll see:

- **Header Bar:** Contains New, Load, Save, and Print buttons
- **Sidebar:** Contains tools and settings
- **Main Canvas:** The central area where you'll work

### Quick Start

1. **Import a Map:**
   - Enter a course name or coordinates in the search box
   - Click "Search" to load the map
   - Or click "Upload Image" to use your own course image

2. **Start Drawing:**
   - Select the Brush tool
   - Choose a color and thickness
   - Click and drag on the canvas to draw

3. **Save Your Work:**
   - Click "Save" to save your project
   - Choose a location and filename
   - Your work is saved as a `.birdie` file

## Features

### Map Import

**Search by Name:**
- Enter a golf course name (e.g., "Augusta National")
- Click "Search"
- The map will center on the location

**Search by Coordinates:**
- Enter coordinates in format: `latitude,longitude`
- Example: `40.7128,-74.0060`
- Click "Search"

**Upload Image:**
- Click "Upload Image"
- Select an image file from your computer
- The image will replace the map tiles

**Blank Canvas:**
- Click "Blank Canvas" to start from scratch
- Useful for designing custom holes

### Drawing Tools

#### Brush Tool

The Brush tool allows you to draw freehand strokes on the canvas.

**How to Use:**
1. Select the Brush tool from the toolbar
2. Choose a color using the color picker
3. Adjust thickness using the slider (1-50 pixels)
4. Click and drag on the canvas to draw

**Tips:**
- Use different colors for different surfaces (fairway, rough, green)
- Adjust thickness for different detail levels
- Draw slowly for smoother lines

#### Stamp Tool

The Stamp tool lets you place predefined icons on the canvas.

**Available Stamps:**
- 🌲 Tree
- 🌿 Bush
- ⚠️ Hazard
- 🏖️ Bunker
- 💧 Water
- 🚩 Flag

**How to Use:**
1. Select the Stamp tool
2. Click on a stamp icon in the sidebar
3. Click on the canvas where you want to place it

**Tips:**
- Use stamps to mark obstacles and features
- Combine stamps with drawings for detailed maps

### Measurement Tool

Measure distances between points on your course map.

**How to Use:**
1. Select the Measure tool
2. Choose unit: Yards or Meters
3. Click the first point
4. Click the second point
5. Distance is displayed and saved

**Measurement Display:**
- Measurements appear as red lines with labels
- All measurements are listed in the sidebar
- Measurements are saved with your project

**Tips:**
- Use measurements to plan shot distances
- Measure from tee to hazards
- Measure landing zones

### Annotation Tool

Add text notes to specific points on your map.

**How to Use:**
1. Select the Annotate tool
2. Click on the canvas where you want the note
3. Enter your text in the prompt
4. The annotation appears at that location

**Tips:**
- Use annotations for course notes
- Mark important landmarks
- Add strategy tips

### Layer Management

Control what's visible on your canvas.

**Available Layers:**
- **Map:** Base map or image
- **Drawings:** Brush strokes and stamps
- **Measurements:** Distance lines and labels
- **Annotations:** Text notes

**How to Use:**
- Check/uncheck layer boxes in the sidebar
- Hidden layers won't appear in exports

**Tips:**
- Hide layers to focus on specific elements
- Toggle measurements when printing
- Hide map for custom designs

## Creating a Birdie Book

### Step-by-Step Guide

1. **Start a New Project**
   - Click "New" or start with a blank canvas
   - Import your course map or image

2. **Set Up Your Map**
   - Search for your course
   - Adjust zoom level
   - Center on the hole you're designing

3. **Draw Course Features**
   - Use Brush tool for fairways, greens, rough
   - Use different colors for different areas
   - Add stamps for obstacles

4. **Add Measurements**
   - Measure key distances
   - Mark hazards
   - Plan landing zones

5. **Add Annotations**
   - Add notes for strategy
   - Mark important points
   - Include course tips

6. **Save Your Work**
   - Click "Save" regularly
   - Use descriptive filenames
   - Keep backups

7. **Export to PDF**
   - Click "Print"
   - Choose paper size (A4, A5, A6)
   - Select orientation (Portrait/Landscape)
   - Click "Export PDF"

## Tools Reference

### Header Buttons

- **New:** Create a new project (clears current work)
- **Load:** Open a saved `.birdie` file
- **Save:** Save current project as `.birdie` file
- **Print:** Open print preview and export options

### Canvas Controls

- **Zoom In:** Increase map zoom level
- **Zoom Out:** Decrease map zoom level
- **Reset View:** Return to default view

### Keyboard Shortcuts

Currently, the application uses mouse/touch interactions. Keyboard shortcuts may be added in future versions.

## Saving and Loading

### Saving Projects

1. Click "Save" button
2. Choose save location
3. Enter filename
4. Click "Save"

**File Format:**
- Projects are saved as `.birdie` files
- Files are JSON format (can be opened in text editor)
- Includes all drawings, measurements, annotations, and settings

### Loading Projects

1. Click "Load" button
2. Navigate to your `.birdie` file
3. Select the file
4. Click "Open"

**What Gets Loaded:**
- Map position and zoom level
- All drawings and stamps
- All measurements
- All annotations
- Brush settings (color, thickness)

## Printing and Exporting

### Print Preview

1. Click "Print" button
2. Select paper size:
   - **A4:** Standard letter size (210 × 297 mm)
   - **A5:** Half letter size (148 × 210 mm)
   - **A6:** Quarter letter size (105 × 148 mm)
3. Select orientation:
   - **Portrait:** Tall format
   - **Landscape:** Wide format
4. Review preview
5. Click "Export PDF"

### PDF Export

- PDFs are saved to your Downloads folder (default)
- Filename: `birdie-book.pdf`
- Includes all visible layers
- High-quality output suitable for printing

**Printing Tips:**
- Use A4 for full-size books
- Use A5 or A6 for pocket-sized books
- Landscape works well for wide holes
- Portrait works well for long holes

## Tips and Tricks

### Creating Better Maps

1. **Use High-Quality Images:**
   - Upload high-resolution course images
   - Use satellite imagery when available
   - Ensure good contrast

2. **Organize Your Layers:**
   - Use different colors for different features
   - Group related elements
   - Use consistent styling

3. **Plan Your Measurements:**
   - Measure key distances first
   - Mark hazards clearly
   - Include yardage markers

4. **Add Strategic Notes:**
   - Note wind conditions
   - Mark pin positions
   - Include club recommendations

### Workflow Tips

1. **Save Frequently:**
   - Save after major changes
   - Use version numbers in filenames
   - Keep backups

2. **Use Layers:**
   - Toggle layers to focus on specific elements
   - Hide measurements when drawing
   - Show all layers before exporting

3. **Zoom Levels:**
   - Zoom in for detail work
   - Zoom out for overview
   - Use reset view to return to default

## Troubleshooting

### Map Not Loading

**Problem:** Map tiles don't appear or search fails.

**Solutions:**
- Check internet connection
- Try a different location name
- Use coordinates instead of name
- Upload an image instead

### Drawing Not Working

**Problem:** Brush tool doesn't draw or stamps don't appear.

**Solutions:**
- Make sure Brush tool is selected
- Check that brush thickness is set
- Verify you're clicking on the canvas area
- Try refreshing the application

### Measurements Not Accurate

**Problem:** Measurements seem incorrect.

**Solutions:**
- Measurements use approximate conversion
- Accuracy depends on map zoom level
- Use manual entry for precise distances (future feature)

### File Won't Save

**Problem:** Save dialog doesn't work or file isn't saved.

**Solutions:**
- Check file permissions
- Ensure sufficient disk space
- Try a different save location
- Check for error messages

### PDF Export Fails

**Problem:** PDF export doesn't work or produces errors.

**Solutions:**
- Ensure canvas has content
- Check available memory
- Try a different paper size
- Restart the application

### Application Crashes

**Problem:** Application closes unexpectedly.

**Solutions:**
- Save your work frequently
- Check system memory
- Update to latest version
- Report the issue with details

## Frequently Asked Questions

**Q: Can I use my own course images?**
A: Yes! Click "Upload Image" to use any image file.

**Q: Can I edit saved projects?**
A: Yes! Load your `.birdie` file, make changes, and save again.

**Q: What file formats are supported?**
A: Projects save as `.birdie` (JSON) files. Images can be JPG, PNG, or other common formats.

**Q: Can I share my Birdie Books?**
A: Yes! Share the `.birdie` files or export as PDF. Online sharing coming in future versions.

**Q: Is there a mobile version?**
A: Not yet, but mobile app is planned for future releases.

**Q: Can I print multiple holes?**
A: Currently, each project represents one hole. Create separate projects for multiple holes.

## Support

For additional help:
- Check the documentation in the DOCS folder
- Review the README.md file
- Open an issue on GitHub
- Check the troubleshooting section above

## Version Information

This manual is for Birdie Book Builder version 1.0.0.

For updates and new features, check the CHANGELOG.md file.
