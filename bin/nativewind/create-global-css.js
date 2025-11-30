const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Creates global.css file
 * @param {string} projectPath - Path to the project directory
 */
function createGlobalCss(projectPath) {
    const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    const globalCssPath = path.join(projectPath, 'global.css');
    fs.writeFileSync(globalCssPath, globalCss);
    console.log(chalk.green('✓ Created global.css'));
}

module.exports = createGlobalCss;

