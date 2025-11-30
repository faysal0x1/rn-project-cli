#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(chalk.blue('React Native Project Creator'));
  console.log(chalk.gray('Usage: rn-create <project-name> [options]'));
  console.log('');
  console.log('Options:');
  console.log('  --expo          Create Expo project (default)');
  console.log('  --no-install    Skip npm install');
  console.log('  --template      Specify template (blank, tabs, etc.)');
  console.log('  --nativewind    Automatically setup NativeWind/TailwindCSS');
  console.log('  --no-nativewind Skip NativeWind setup (default)');
  console.log('');
  console.log('Examples:');
  console.log('  rn-create my-app');
  console.log('  rn-create my-app --no-install');
  console.log('  rn-create my-app --template tabs');
  console.log('  rn-create my-app --nativewind');
  process.exit(0);
}

const projectName = args[0];
const options = args.slice(1);

// Validate project name
if (!projectName || projectName.startsWith('-')) {
  console.error(chalk.red('Error: Project name is required'));
  process.exit(1);
}

// Check if directory already exists
const projectPath = path.resolve(process.cwd(), projectName);
if (fs.existsSync(projectPath)) {
  console.error(chalk.red(`Error: Directory "${projectName}" already exists`));
  process.exit(1);
}

// Parse options
const hasNoInstall = options.includes('--no-install');
const hasNativeWind = options.includes('--nativewind');
const hasNoNativeWind = options.includes('--no-nativewind');
const templateIndex = options.indexOf('--template');
let template = null;

if (templateIndex !== -1 && options[templateIndex + 1]) {
  template = options[templateIndex + 1];
}

// Build create-expo-app command
const npxPath = process.platform === 'win32'
  ? (fs.existsSync('C:\\Program Files\\PhpWebStudy-Data\\env\\node\\npx.cmd')
    ? '"C:\\Program Files\\PhpWebStudy-Data\\env\\node\\npx.cmd"'
    : 'npx')
  : 'npx';

let command = `${npxPath} --yes create-expo-app@latest ${projectName}`;

if (template) {
  command += ` --template ${template}`;
}

if (hasNoInstall) {
  command += ' --no-install';
}

console.log(chalk.blue('Creating React Native/Expo project...'));
console.log(chalk.gray(`Project name: ${projectName}`));
if (template) {
  console.log(chalk.gray(`Template: ${template}`));
}
if (hasNoInstall) {
  console.log(chalk.gray('Skipping npm install'));
}
console.log('');

// Main execution function
async function main() {
  // Ask about NativeWind if not specified
  let setupNativeWind = hasNativeWind;

  if (!hasNativeWind && !hasNoNativeWind) {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'setupNativeWind',
        message: 'Would you like to setup NativeWind/TailwindCSS?',
        default: false
      }
    ]);
    setupNativeWind = answer.setupNativeWind;
  }

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
      shell: true
    });

    console.log('');
    console.log(chalk.green('✓ Project created successfully!'));

    // Setup NativeWind if requested
    if (setupNativeWind) {
      console.log('');
      console.log(chalk.blue('Setting up NativeWind/TailwindCSS...'));
      setupNativeWindConfig(projectPath, hasNoInstall);
    }

    console.log('');
    console.log(chalk.blue('Next steps:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    if (hasNoInstall) {
      console.log(chalk.gray('  npm install'));
    }
    if (setupNativeWind && hasNoInstall) {
      console.log(chalk.gray('  npm install nativewind tailwindcss'));
    }
    console.log(chalk.gray('  npx expo start'));

  } catch (error) {
    console.error(chalk.red('Error creating project:'), error.message);
    process.exit(1);
  }
}

// Run main function
main().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});

function setupNativeWindConfig(projectPath, skipInstall) {
  try {
    // Detect if TypeScript project
    const isTypeScript = fs.existsSync(path.join(projectPath, 'tsconfig.json'));
    const appExtension = isTypeScript ? 'tsx' : 'js';

    // Find entry point file
    let entryFile = null;
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
        entryFile = filePath;
        break;
      }
    }

    if (!entryFile) {
      // Try to find any .js or .tsx file in root or src
      const rootFiles = fs.readdirSync(projectPath).filter(f =>
        !f.startsWith('.') && !f.includes('node_modules')
      );

      for (const file of rootFiles) {
        if (file.match(/^(App|_layout|index)\.[jt]sx?$/)) {
          const filePath = path.join(projectPath, file);
          if (fs.existsSync(filePath)) {
            entryFile = filePath;
            break;
          }
        }
      }

      // Check src directory
      if (!entryFile) {
        const srcPath = path.join(projectPath, 'src');
        if (fs.existsSync(srcPath)) {
          const srcFiles = fs.readdirSync(srcPath).filter(f =>
            !f.startsWith('.')
          );
          for (const file of srcFiles) {
            if (file.match(/^(App|_layout|index)\.[jt]sx?$/)) {
              const filePath = path.join(srcPath, file);
              if (fs.existsSync(filePath)) {
                entryFile = filePath;
                break;
              }
            }
          }
        }
      }

      // Check app directory
      if (!entryFile) {
        const appPath = path.join(projectPath, 'app');
        if (fs.existsSync(appPath)) {
          const appFiles = fs.readdirSync(appPath).filter(f =>
            !f.startsWith('.')
          );
          for (const file of appFiles) {
            if (file.match(/^_layout\.[jt]sx?$/)) {
              const filePath = path.join(appPath, file);
              if (fs.existsSync(filePath)) {
                entryFile = filePath;
                break;
              }
            }
          }
        }
      }
    }

    // Install NativeWind packages
    if (!skipInstall) {
      console.log(chalk.gray('Installing NativeWind and TailwindCSS...'));
      execSync('npm install nativewind tailwindcss', {
        stdio: 'inherit',
        cwd: projectPath,
        shell: true
      });
    } else {
      console.log(chalk.yellow('⚠ Skipping package installation. Run: npm install nativewind tailwindcss'));
    }

    // Create tailwind.config.js
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    fs.writeFileSync(
      path.join(projectPath, 'tailwind.config.js'),
      tailwindConfig
    );
    console.log(chalk.green('✓ Created tailwind.config.js'));

    // Create global.css
    const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    const globalCssPath = path.join(projectPath, 'global.css');
    fs.writeFileSync(globalCssPath, globalCss);
    console.log(chalk.green('✓ Created global.css'));

    // Update babel.config.js
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

    // Update entry file to import global.css
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

    // Update metro.config.js if it exists
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
