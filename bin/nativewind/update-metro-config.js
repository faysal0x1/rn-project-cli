const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Updates metro.config.js to use withNativeWind wrapper
 * @param {string} projectPath - Path to the project directory
 */
function updateMetroConfig(projectPath) {
  const metroConfigPath = path.join(projectPath, 'metro.config.js');
  
  // Check if already configured with withNativeWind
  if (fs.existsSync(metroConfigPath)) {
    const metroConfig = fs.readFileSync(metroConfigPath, 'utf8');
    if (metroConfig.includes('withNativeWind')) {
      console.log(chalk.gray('✓ metro.config.js already configured with NativeWind'));
      return;
    }
  }

  // Create/update metro config with withNativeWind
  const newMetroConfig = `const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
`;

  fs.writeFileSync(metroConfigPath, newMetroConfig);
  console.log(chalk.green('✓ Updated metro.config.js'));
}

module.exports = updateMetroConfig;
