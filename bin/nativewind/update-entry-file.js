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
            // Add import at the top
            const importStatement = "import './global.css';\n";
            entryContent = importStatement + entryContent;
            fs.writeFileSync(entryFile, entryContent);
            console.log(chalk.green(`✓ Updated ${path.basename(entryFile)}`));
        }
    } else {
        console.log(chalk.yellow(`⚠ Could not find entry file. Please manually import './global.css' in your root component.`));
    }
}

module.exports = updateEntryFile;

