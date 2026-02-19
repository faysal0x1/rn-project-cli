const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const findEntryFile = require('./find-entry-file');
const installPackages = require('./install-packages');
const createTailwindConfig = require('./create-tailwind-config');
const createGlobalCss = require('./create-global-css');
const updateBabelConfig = require('./update-babel-config');
const updateEntryFile = require('./update-entry-file');
const updateMetroConfig = require('./update-metro-config');
const updateTsConfig = require('./update-tsconfig');

/**
 * Sets up NativeWind and TailwindCSS for a React Native/Expo project
 * @param {string} projectPath - Path to the project directory
 * @param {boolean} skipInstall - Whether to skip npm install
 */
function setupNativeWindConfig(projectPath, skipInstall) {
  try {
    // Detect if TypeScript project
    const isTypeScript = fs.existsSync(path.join(projectPath, 'tsconfig.json'));
    const appExtension = isTypeScript ? 'tsx' : 'js';

    // Find entry point file
    const entryFile = findEntryFile(projectPath, appExtension);

    // Install NativeWind packages
    installPackages(projectPath, skipInstall);

    // Create tailwind.config.js
    createTailwindConfig(projectPath);

    // Create global.css
    createGlobalCss(projectPath);

    // Update babel.config.js
    updateBabelConfig(projectPath);

    // Update entry file to import global.css
    updateEntryFile(projectPath, entryFile);

    // Update metro.config.js
    updateMetroConfig(projectPath);

    // Update tsconfig.json (if TypeScript project)
    if (isTypeScript) {
      updateTsConfig(projectPath);
    }

    console.log('');
    console.log(chalk.green('✓ NativeWind/TailwindCSS setup complete!'));
    console.log('');
    console.log(chalk.blue('Usage example:'));
    console.log(chalk.gray('  <View className="flex-1 items-center justify-center bg-white">'));
    console.log(chalk.gray('    <Text className="text-2xl font-bold text-blue-500">Hello NativeWind!</Text>'));
    console.log(chalk.gray('  </View>'));

  } catch (error) {
    console.error(chalk.red('Error setting up NativeWind:'), error.message);
    console.log(chalk.yellow('You can manually setup NativeWind following the official documentation.'));
  }
}

module.exports = setupNativeWindConfig;

