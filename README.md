# Birdie Book Builder

A desktop application for golfers to design and print personalized Birdie Books for golf courses.

## Features

- **Map Import**: Fetch satellite imagery via OpenStreetMap API or upload your own images
- **Autonomous Design**: Design holes from scratch on a blank canvas if imagery is unavailable
- **Drawing Tools**: Customizable brushes for surfaces with adjustable color and thickness
- **Stamps**: Predefined stamps for trees, bushes, hazards, bunkers, water, and flags
- **Measurement Tool**: Click-to-measure distances in yards or meters
- **Annotations**: Add text notes and range marks to points of interest
- **Layer Management**: Toggle visibility of map, drawings, measurements, and annotations
- **Save/Load**: Save your work locally in `.birdie` format
- **Print/Export**: Export to PDF in A4, A5, or A6 formats (portrait or landscape)

## Requirements

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Birdie_Book_builder
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Running the Application

Start the application in development mode:
```bash
npm start
```

Or with developer tools:
```bash
npm run dev
```

### Creating a Birdie Book

1. **Import a Map**:
   - Enter a course name or coordinates (latitude, longitude) in the search box and click "Search"
   - Or click "Upload Image" to use your own course image
   - Or click "Blank Canvas" to start from scratch

2. **Draw on the Course**:
   - Select the Brush tool to draw surfaces
   - Adjust color and thickness in the sidebar
   - Use the Stamp tool to add trees, bushes, hazards, etc.

3. **Measure Distances**:
   - Select the Measure tool
   - Click two points to measure the distance
   - Choose between yards or meters

4. **Add Annotations**:
   - Select the Annotate tool
   - Click on the map to add text notes

5. **Manage Layers**:
   - Toggle visibility of different layers using the checkboxes in the sidebar

6. **Save Your Work**:
   - Click "Save" to save your project as a `.birdie` file
   - Click "Load" to open a previously saved project

7. **Print/Export**:
   - Click "Print" to open the print preview
   - Select paper size (A4, A5, or A6) and orientation
   - Click "Export PDF" to generate a PDF file

## Project Structure

```
Birdie_Book_builder/
├── main.js           # Electron main process
├── index.html        # Application UI
├── app.js            # Application logic
├── styles.css        # Application styles
├── package.json      # Project dependencies
├── README.md         # This file
├── LICENSE           # MIT License
└── DOCS/             # Documentation
    ├── API.md              # API documentation
    ├── ARCHITECTURE.md     # Architecture documentation
    ├── DEVELOPER.md        # Developer guide
    ├── USER_MANUAL.md      # User manual
    ├── CONTRIBUTING.md     # Contributing guidelines
    ├── CHANGELOG.md        # Version history
    └── birdie_book_builder_sdd.pdf  # Software Design Document
```

## Technology Stack

- **Electron.js**: Cross-platform desktop application framework
- **Leaflet.js**: Interactive map library
- **OpenStreetMap**: Free map tiles
- **jsPDF**: PDF generation
- **html2canvas**: Canvas to image conversion

## Documentation

Comprehensive documentation is available in the `DOCS/` folder:

- **[API Documentation](DOCS/API.md)** - Internal APIs and IPC interfaces
- **[Architecture Documentation](DOCS/ARCHITECTURE.md)** - System architecture and design patterns
- **[Developer Guide](DOCS/DEVELOPER.md)** - Setup, development workflow, and guidelines
- **[User Manual](DOCS/USER_MANUAL.md)** - Complete user guide with step-by-step instructions
- **[Contributing Guide](DOCS/CONTRIBUTING.md)** - How to contribute to the project
- **[Releases Guide](DOCS/RELEASES.md)** - GitHub Releases workflow and automation
- **[Changelog](DOCS/CHANGELOG.md)** - Version history and release notes

## Development

The application uses Electron.js for cross-platform desktop support. The main process (`main.js`) handles file operations, while the renderer process (`app.js`) handles the UI and drawing logic.

For detailed development information, see the [Developer Guide](DOCS/DEVELOPER.md).

## Future Enhancements

- Online community for sharing and rating Birdie Books
- Mobile app version
- Advanced analytics (e.g., optimal landing zones)
- Snap-to-edge feature for tracing edges on satellite imagery
- Enhanced measurement accuracy with proper map scale calculation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](DOCS/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.
