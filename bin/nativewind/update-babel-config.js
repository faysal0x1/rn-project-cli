const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Updates babel.config.js to include nativewind preset and reanimated plugin
 * @param {string} projectPath - Path to the project directory
 */
function updateBabelConfig(projectPath) {
  const babelConfigPath = path.join(projectPath, 'babel.config.js');

  if (fs.existsSync(babelConfigPath)) {
    let babelConfig = fs.readFileSync(babelConfigPath, 'utf8');

    // 0. Update babel-preset-expo to include jsxImportSource
    if (babelConfig.includes("'babel-preset-expo'") && !babelConfig.includes('jsxImportSource')) {
      babelConfig = babelConfig.replace(
        /'babel-preset-expo'/g,
        "['babel-preset-expo', { jsxImportSource: 'nativewind' }]"
      );
      console.log(chalk.green("✓ Updated babel-preset-expo with jsxImportSource"));
    }

    // 1. Handle Presets
    if (!babelConfig.includes('nativewind/babel')) {
      if (babelConfig.includes('presets:')) {
        // Add to existing presets
        babelConfig = babelConfig.replace(
          /presets:\s*\[/,
          "presets: [\n      'nativewind/babel',"
        );
      } else {
        // Add presets array
        if (babelConfig.includes('return {')) {
          babelConfig = babelConfig.replace(
            /return\s*\{/,
            "return {\n    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],"
          );
        } else if (babelConfig.includes('module.exports = {')) {
          babelConfig = babelConfig.replace(
            /module\.exports\s*=\s*\{/,
            "module.exports = {\n  presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],"
          );
        }
      }
      console.log(chalk.green('✓ Added nativewind/babel to presets'));
    }

    // 2. Handle Plugins (Reanimated)
    if (!babelConfig.includes('react-native-reanimated/plugin')) {
      if (babelConfig.includes('plugins:')) {
        // Add to existing plugins (prepend safely)
        babelConfig = babelConfig.replace(
          /plugins:\s*\[/,
          "plugins: [\n      'react-native-reanimated/plugin',"
        );
      } else {
        // Add plugins array
        // Try to find where to insert plugins (after presets usually)
        if (babelConfig.includes('presets: [')) {
          // Insert after closing bracket of presets (simple heuristic)
          babelConfig = babelConfig.replace(
            /(presets:\s*\[[\s\S]*?\]),/,
            "$1,\n    plugins: ['react-native-reanimated/plugin'],"
          );
        } else if (babelConfig.includes('return {')) {
          // Fallback for empty return object
          babelConfig = babelConfig.replace(
            /return\s*\{/,
            "return {\n    plugins: ['react-native-reanimated/plugin'],"
          );
        }
      }
      console.log(chalk.green('✓ Added react-native-reanimated/plugin'));
    }

    fs.writeFileSync(babelConfigPath, babelConfig);

  } else {
    // Create babel.config.js if it doesn't exist
    const babelConfig = `module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};`;
    fs.writeFileSync(babelConfigPath, babelConfig);
    console.log(chalk.green('✓ Created babel.config.js'));
  }
}

module.exports = updateBabelConfig;
