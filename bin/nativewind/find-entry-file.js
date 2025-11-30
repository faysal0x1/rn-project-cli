const path = require('path');
const fs = require('fs');

/**
 * Finds the entry point file for the project
 * @param {string} projectPath - Path to the project directory
 * @param {string} appExtension - File extension (js or tsx)
 * @returns {string|null} - Path to entry file or null if not found
 */
function findEntryFile(projectPath, appExtension) {
  const possibleEntryFiles = [
    `App.${appExtension}`,
    `app.${appExtension}`,
    `src/App.${appExtension}`,
    `src/app.${appExtension}`,
    `app/_layout.${appExtension}`,
    `src/app/_layout.${appExtension}`
  ];

  for (const file of possibleEntryFiles) {
    const filePath = path.join(projectPath, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  // Try to find any .js or .tsx file in root or src
  const rootFiles = fs.readdirSync(projectPath).filter(f =>
    !f.startsWith('.') && !f.includes('node_modules')
  );

  for (const file of rootFiles) {
    if (file.match(/^(App|_layout|index)\.[jt]sx?$/)) {
      const filePath = path.join(projectPath, file);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
  }

  // Check src directory
  const srcPath = path.join(projectPath, 'src');
  if (fs.existsSync(srcPath)) {
    const srcFiles = fs.readdirSync(srcPath).filter(f =>
      !f.startsWith('.')
    );
    for (const file of srcFiles) {
      if (file.match(/^(App|_layout|index)\.[jt]sx?$/)) {
        const filePath = path.join(srcPath, file);
        if (fs.existsSync(filePath)) {
          return filePath;
        }
      }
    }
  }

  // Check app directory
  const appPath = path.join(projectPath, 'app');
  if (fs.existsSync(appPath)) {
    const appFiles = fs.readdirSync(appPath).filter(f =>
      !f.startsWith('.')
    );
    for (const file of appFiles) {
      if (file.match(/^_layout\.[jt]sx?$/)) {
        const filePath = path.join(appPath, file);
        if (fs.existsSync(filePath)) {
          return filePath;
        }
      }
    }
  }

  return null;
}

module.exports = findEntryFile;

