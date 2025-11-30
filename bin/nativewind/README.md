# NativeWind Setup Module

This folder contains modular files for setting up NativeWind/TailwindCSS in React Native/Expo projects.

## File Structure

Each file handles a specific part of the NativeWind setup:

### Core Files

- **`index.js`** - Main orchestrator that coordinates all setup steps
- **`find-entry-file.js`** - Finds the project's entry point file (App.js, App.tsx, etc.)

### Configuration Files

- **`create-tailwind-config.js`** - Creates `tailwind.config.js`
- **`create-global-css.js`** - Creates `global.css` with Tailwind directives
- **`update-babel-config.js`** - Updates `babel.config.js` with NativeWind plugin
- **`update-metro-config.js`** - Updates `metro.config.js` with CSS transformer
- **`update-entry-file.js`** - Adds CSS import to the entry file

### Installation

- **`install-packages.js`** - Installs `nativewind` and `tailwindcss` packages

## How to Modify

Each file is independent and can be modified separately:

- **To change Tailwind config**: Edit `create-tailwind-config.js`
- **To change CSS content**: Edit `create-global-css.js`
- **To change Babel setup**: Edit `update-babel-config.js`
- **To change Metro setup**: Edit `update-metro-config.js`
- **To change entry file detection**: Edit `find-entry-file.js`
- **To change package installation**: Edit `install-packages.js`

## Usage

The main `index.js` file exports a single function that orchestrates all setup steps:

```javascript
const setupNativeWindConfig = require('./nativewind');

setupNativeWindConfig(projectPath, skipInstall);
```

## Adding New Setup Steps

To add a new setup step:

1. Create a new file in this folder (e.g., `create-custom-file.js`)
2. Export a function that takes `projectPath` as parameter
3. Import and call it in `index.js`

Example:
```javascript
// create-custom-file.js
function createCustomFile(projectPath) {
  // Your setup logic here
}

module.exports = createCustomFile;
```

```javascript
// index.js
const createCustomFile = require('./create-custom-file');
// ... in setupNativeWindConfig function:
createCustomFile(projectPath);
```

