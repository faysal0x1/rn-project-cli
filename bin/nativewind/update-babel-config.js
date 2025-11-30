const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Updates babel.config.js to include NativeWind plugin
 * @param {string} projectPath - Path to the project directory
 */
function updateBabelConfig(projectPath) {
    const babelConfigPath = path.join(projectPath, 'babel.config.js');
    if (fs.existsSync(babelConfigPath)) {
        let babelConfig = fs.readFileSync(babelConfigPath, 'utf8');

        // Check if nativewind plugin already exists
        if (!babelConfig.includes('nativewind/babel')) {
            // Add nativewind plugin to babel config
            babelConfig = babelConfig.replace(
                /plugins:\s*\[/,
                "plugins: [\n    'nativewind/babel',"
            );

            // If plugins array doesn't exist, add it
            if (!babelConfig.includes('plugins:')) {
                if (babelConfig.includes('module.exports')) {
                    babelConfig = babelConfig.replace(
                        /module\.exports\s*=\s*\{/,
                        "module.exports = {\n  plugins: ['nativewind/babel'],"
                    );
                } else {
                    babelConfig += "\nmodule.exports = { plugins: ['nativewind/babel'] };";
                }
            }

            fs.writeFileSync(babelConfigPath, babelConfig);
            console.log(chalk.green('✓ Updated babel.config.js'));
        }
    } else {
        // Create babel.config.js if it doesn't exist
        const babelConfig = `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};`;
        fs.writeFileSync(babelConfigPath, babelConfig);
        console.log(chalk.green('✓ Created babel.config.js'));
    }
}

module.exports = updateBabelConfig;

