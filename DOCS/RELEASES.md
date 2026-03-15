# GitHub Releases Guide

## Overview

GitHub Releases is a feature that allows you to package and distribute software versions. It's perfect for distributing your Electron application builds to users.

## What are GitHub Releases?

GitHub Releases are:
- **Versioned snapshots** of your code at specific points in time
- **Distribution packages** for your software (installers, binaries, etc.)
- **Release notes** documenting what's new, changed, or fixed
- **Downloadable assets** that users can install

## How GitHub Releases Work

### 1. Git Tags

Releases are based on **Git tags**, which mark specific commits in your repository:

```bash
# Create a tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to GitHub
git push origin v1.0.0
```

**Tag Naming Convention:**
- Use semantic versioning: `v1.0.0`, `v1.1.0`, `v2.0.0`
- Prefix with `v` (e.g., `v1.0.0`)
- Follow SemVer: `MAJOR.MINOR.PATCH`

### 2. Creating a Release

**Via GitHub Web Interface:**

1. Go to your repository on GitHub
2. Click **"Releases"** in the right sidebar (or go to `/releases`)
3. Click **"Create a new release"**
4. Choose or create a tag (e.g., `v1.0.0`)
5. Add release title (e.g., "Version 1.0.0")
6. Write release notes describing changes
7. Upload build artifacts (installers, binaries)
8. Mark as **"Latest release"** if it's the current version
9. Click **"Publish release"**

**Via GitHub CLI:**

```bash
# Install GitHub CLI if not installed
# Then authenticate: gh auth login

# Create release
gh release create v1.0.0 \
  --title "Version 1.0.0" \
  --notes "Initial release of Birdie Book Builder" \
  dist/*.exe dist/*.dmg dist/*.AppImage
```

**Via API:**

You can also create releases programmatically using the GitHub API.

### 3. Release Components

A GitHub Release consists of:

1. **Tag**: Git tag pointing to a specific commit
2. **Title**: Release name (e.g., "Version 1.0.0")
3. **Description**: Release notes (markdown supported)
4. **Assets**: Files attached to the release:
   - Windows: `.exe` installer
   - macOS: `.dmg` or `.zip`
   - Linux: `.AppImage`, `.deb`, `.rpm`
5. **Pre-release**: Mark as pre-release for beta/alpha versions
6. **Latest**: Mark as the latest release

### 4. Release Notes

Release notes should include:

```markdown
## What's New
- Feature 1
- Feature 2

## Improvements
- Improvement 1
- Improvement 2

## Bug Fixes
- Fixed issue X
- Fixed issue Y

## Installation
Download the installer for your platform from the assets below.
```

## Workflow for Birdie Book Builder

### Step 1: Update Version

Before creating a release, update the version in `package.json`:

```json
{
  "version": "1.0.0"
}
```

### Step 2: Build the Application

Build platform-specific distributables:

```bash
# Build for all platforms
npm run build

# Or build for specific platform
npm run build -- --win    # Windows
npm run build -- --mac    # macOS
npm run build -- --linux  # Linux
```

Builds will be in the `dist/` directory.

### Step 3: Create Git Tag

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to GitHub
git push origin v1.0.0
```

### Step 4: Create Release on GitHub

1. Go to GitHub repository → Releases → "Draft a new release"
2. Select tag `v1.0.0`
3. Title: "Birdie Book Builder v1.0.0"
4. Description: Copy from `DOCS/CHANGELOG.md`
5. Upload build files from `dist/`:
   - `birdie-book-builder-1.0.0-win-x64.exe` (Windows)
   - `birdie-book-builder-1.0.0-mac-x64.dmg` (macOS)
   - `birdie-book-builder-1.0.0-linux-x64.AppImage` (Linux)
6. Click "Publish release"

### Step 5: Verify Release

- Check that release appears on `/releases` page
- Verify download links work
- Test installer on target platform

## Automated Releases

### Using GitHub Actions

You can automate the release process with GitHub Actions. Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist/
```

### Using electron-builder with GitHub

Configure `electron-builder` to automatically publish to GitHub:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "Birdie_Book_builder"
    }
  }
}
```

Then build and publish:

```bash
npm run build -- --publish always
```

## Best Practices

### 1. Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backward compatible
- **PATCH** (1.0.1): Bug fixes

### 2. Release Notes

- Write clear, user-friendly release notes
- Use markdown formatting
- Link to issues/PRs: `#123`
- Group changes by type (Added, Changed, Fixed, Removed)

### 3. Pre-releases

Use pre-releases for:
- Beta versions: `v1.1.0-beta.1`
- Alpha versions: `v2.0.0-alpha.1`
- Release candidates: `v1.1.0-rc.1`

### 4. Changelog

Keep `CHANGELOG.md` updated:
- Update before each release
- Copy relevant sections to release notes
- Maintain chronological order

### 5. Testing

- Test installers on target platforms
- Verify all features work
- Check for regressions
- Test upgrade path from previous version

## Release Checklist

Before creating a release:

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Run tests (when available)
- [ ] Build for all target platforms
- [ ] Test installers
- [ ] Create git tag
- [ ] Push tag to GitHub
- [ ] Create release on GitHub
- [ ] Upload build artifacts
- [ ] Write release notes
- [ ] Publish release
- [ ] Verify downloads work
- [ ] Announce release (if applicable)

## Accessing Releases

Users can access releases via:

1. **GitHub Releases Page**: `https://github.com/username/repo/releases`
2. **Latest Release**: `https://github.com/username/repo/releases/latest`
3. **Tag Page**: `https://github.com/username/repo/releases/tag/v1.0.0`
4. **API**: `https://api.github.com/repos/username/repo/releases`

## Download URLs

GitHub provides direct download URLs:

```
https://github.com/username/repo/releases/download/v1.0.0/filename.exe
```

Useful for:
- Direct download links
- Update checks
- Automated installers

## Troubleshooting

### Tag Already Exists

If tag exists, delete and recreate:

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0

# Create new tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Build Fails

- Check Node.js version
- Verify dependencies installed
- Check platform-specific requirements
- Review build logs

### Release Not Appearing

- Verify tag was pushed
- Check release was published (not draft)
- Refresh GitHub page
- Check repository permissions

## Resources

- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Semantic Versioning](https://semver.org/)
- [electron-builder Documentation](https://www.electron.build/)
- [GitHub Actions](https://docs.github.com/en/actions)
