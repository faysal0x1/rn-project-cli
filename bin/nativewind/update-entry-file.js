const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Updates entry file to import global.css
 * @param {string} projectPath - Path to the project directory
 * @param {string|null} entryFile - Path to entry file
 */
function updateEntryFile(projectPath, entryFile) {
  if (entryFile && fs.existsSync(entryFile)) {
    let entryContent = fs.readFileSync(entryFile, 'utf8');

    // Check if import already exists
    if (!entryContent.includes('global.css')) {
      // Determine correct import path based on file location
      const entryDir = path.dirname(entryFile);
      const projectRoot = projectPath;
      const globalCssPath = path.join(projectRoot, 'global.css');
      
      // Calculate relative path from entry file to global.css
      const relativePath = path.relative(entryDir, globalCssPath).replace(/\\/g, '/');
      
      // Ensure path starts with ./ or ../
      let importPath = relativePath;
      if (!importPath.startsWith('.')) {
        importPath = './' + importPath;
      }
      
      // Add import at the top (after other imports if they exist)
      const importStatement = `import '${importPath}';\n`;
      
      // Try to insert after existing imports, otherwise at the top
      const importRegex = /^(import\s+.*?;?\s*)+/m;
      if (importRegex.test(entryContent)) {
        entryContent = entryContent.replace(importRegex, (match) => {
          return match + importStatement;
        });
      } else {
        entryContent = importStatement + entryContent;
      }
      
      fs.writeFileSync(entryFile, entryContent);
      console.log(chalk.green(`✓ Updated ${path.basename(entryFile)}`));
    } else {
      console.log(chalk.gray(`✓ ${path.basename(entryFile)} already imports global.css`));
    }
  } else {
    console.log(chalk.yellow(`⚠ Could not find entry file. Please manually import './global.css' in your root component.`));
  }
}

module.exports = updateEntryFile;
