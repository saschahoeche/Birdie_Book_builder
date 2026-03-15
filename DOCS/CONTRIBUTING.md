# Contributing to Birdie Book Builder

Thank you for your interest in contributing to Birdie Book Builder! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

1. **Clear Title:** Brief description of the issue
2. **Description:** Detailed explanation of the problem
3. **Steps to Reproduce:** Step-by-step instructions
4. **Expected Behavior:** What should happen
5. **Actual Behavior:** What actually happens
6. **Screenshots:** If applicable
7. **Environment:** OS, version, etc.

**Issue Template:**
```markdown
**Bug Description:**
[Clear description]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- OS: [e.g., Windows 10]
- Version: [e.g., 1.0.0]
```

### Suggesting Features

Feature suggestions are welcome! Please include:

1. **Clear Title:** Brief description of the feature
2. **Use Case:** Why this feature would be useful
3. **Proposed Solution:** How you envision it working
4. **Alternatives:** Other solutions you've considered

**Feature Template:**
```markdown
**Feature Description:**
[Clear description]

**Use Case:**
[Why this would be useful]

**Proposed Solution:**
[How it should work]

**Alternatives Considered:**
[Other options]
```

### Pull Requests

1. **Fork the Repository**
2. **Create a Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes:**
   - Follow code style guidelines
   - Add JSDoc comments
   - Update documentation if needed
4. **Test Your Changes:**
   - Test manually
   - Ensure no regressions
5. **Commit Changes:**
   ```bash
   git commit -m "Add: description of changes"
   ```
6. **Push to Your Fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open Pull Request:**
   - Fill out the PR template
   - Link related issues
   - Request review

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Setup Steps

1. **Fork and Clone:**
   ```bash
   git clone https://github.com/your-username/Birdie_Book_builder.git
   cd Birdie_Book_builder
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development:**
   ```bash
   npm run dev
   ```

## Coding Standards

### JavaScript

- Use **ES6+** features
- Follow **camelCase** for variables/functions
- Use **PascalCase** for constructors
- Add **JSDoc comments** for all functions
- Use **2 spaces** for indentation
- Maximum line length: **100 characters**

**Example:**
```javascript
/**
 * Calculates distance between two points.
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

### CSS

- Use **kebab-case** for class names
- Group related styles
- Use meaningful names
- Comment complex styles

### HTML

- Use semantic HTML5
- Include ARIA labels
- Keep structure clean

### Git Commit Messages

Follow conventional commits:

- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Changes to existing features
- `Remove:` Removal of features
- `Docs:` Documentation changes
- `Style:` Code style changes
- `Refactor:` Code refactoring
- `Test:` Test additions/changes

**Examples:**
```
Add: measurement tool with yards/meters support
Fix: canvas drawing not working on resize
Update: improve PDF export quality
Docs: add API documentation
```

## Project Structure

Understand the project structure before contributing:

- `main.js` - Electron main process
- `app.js` - Application logic
- `index.html` - UI structure
- `styles.css` - Styling
- `DOCS/` - Documentation

## Areas for Contribution

### High Priority

- [ ] Improved measurement accuracy
- [ ] Snap-to-edge feature
- [ ] Undo/redo functionality
- [ ] Better error handling
- [ ] Unit tests

### Medium Priority

- [ ] Additional stamp types
- [ ] Custom color palettes
- [ ] Grid/guides for drawing
- [ ] Keyboard shortcuts
- [ ] Multi-hole support

### Low Priority

- [ ] Themes
- [ ] Export formats (PNG, SVG)
- [ ] Cloud storage integration
- [ ] Mobile app version

## Testing

### Manual Testing

Before submitting, test:

- [ ] All tools work correctly
- [ ] Save/load functionality
- [ ] PDF export
- [ ] Map import (search and upload)
- [ ] Layer visibility
- [ ] Canvas resize handling

### Future: Automated Testing

We plan to add:
- Unit tests (Jest)
- Integration tests
- E2E tests

## Documentation

### Code Documentation

- Add JSDoc comments to all functions
- Document complex logic
- Explain "why" not just "what"

### User Documentation

- Update USER_MANUAL.md for user-facing changes
- Add screenshots for new features
- Update examples

### Developer Documentation

- Update DEVELOPER.md for developer-facing changes
- Document new APIs
- Update architecture docs if needed

## Review Process

1. **Automated Checks:**
   - Code style (if linter added)
   - Build success

2. **Code Review:**
   - Functionality
   - Code quality
   - Documentation
   - Performance

3. **Testing:**
   - Manual testing
   - Cross-platform testing

4. **Merge:**
   - Approved by maintainer
   - All checks pass
   - Documentation updated

## Questions?

- Check existing documentation
- Open a discussion
- Ask in issues
- Review code comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md (if created)
- Credited in release notes
- Acknowledged in the project

Thank you for contributing to Birdie Book Builder!
