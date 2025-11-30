const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Updates metro.config.js to include CSS transformer
 * @param {string} projectPath - Path to the project directory
 */
function updateMetroConfig(projectPath) {
    const metroConfigPath = path.join(projectPath, 'metro.config.js');
    if (fs.existsSync(metroConfigPath)) {
        let metroConfig = fs.readFileSync(metroConfigPath, 'utf8');

        // Check if css transformer is configured
        if (!metroConfig.includes('cssToReactNativeRuntime')) {
            // Try to update metro config
            try {
                // Check if it uses getDefaultConfig
                if (metroConfig.includes('getDefaultConfig')) {
                    // Update existing config
                    metroConfig = metroConfig.replace(
                        /config\.transformer\s*=\s*\{/,
                        'config.transformer = {\n    ...config.transformer,\n    cssToReactNativeRuntime: true,'
                    );

                    if (!metroConfig.includes('cssToReactNativeRuntime')) {
                        // Add after getDefaultConfig
                        metroConfig = metroConfig.replace(
                            /(const config = getDefaultConfig\(__dirname\);)/,
                            "$1\n\nconfig.transformer = {\n  ...config.transformer,\n  cssToReactNativeRuntime: true,\n};"
                        );
                    }

                    fs.writeFileSync(metroConfigPath, metroConfig);
                    console.log(chalk.green('✓ Updated metro.config.js'));
                } else {
                    // Create new metro config
                    const newMetroConfig = `const { getDefaultConfig } = require('expo/metro-config');\n\nconst config = getDefaultConfig(__dirname);\n\nconfig.transformer = {\n  ...config.transformer,\n  cssToReactNativeRuntime: true,\n};\n\nmodule.exports = config;`;
                    fs.writeFileSync(metroConfigPath, newMetroConfig);
                    console.log(chalk.green('✓ Updated metro.config.js'));
                }
            } catch (e) {
                // If parsing fails, add a note
                console.log(chalk.yellow('⚠ Could not auto-update metro.config.js. You may need to configure CSS transformer manually.'));
            }
        }
    } else {
        // Create metro.config.js if it doesn't exist
        const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');\n\nconst config = getDefaultConfig(__dirname);\n\nconfig.transformer = {\n  ...config.transformer,\n  cssToReactNativeRuntime: true,\n};\n\nmodule.exports = config;`;
        fs.writeFileSync(metroConfigPath, metroConfig);
        console.log(chalk.green('✓ Created metro.config.js'));
    }
}

module.exports = updateMetroConfig;

