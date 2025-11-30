#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const setupNativeWindConfig = require('./nativewind');

// Get package version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Get command line arguments
const args = process.argv.slice(2);

// Handle version flag (must be checked first, before any other processing)
if (args.includes('--version') || args.includes('-v') || args[0] === '--version' || args[0] === '-v') {
  console.log(version);
  process.exit(0);
}

if (args.length === 0) {
  console.log(chalk.blue('React Native Project Creator'));
  console.log(chalk.gray(`Version: ${version}`));
  console.log(chalk.gray('Usage: rn-create <project-name> [options]'));
  console.log('');
  console.log('Options:');
  console.log('  --expo          Create Expo project (default)');
  console.log('  --no-install    Skip npm install');
  console.log('  --template      Specify template (blank, tabs, etc.)');
  console.log('  --nativewind    Automatically setup NativeWind/TailwindCSS');
  console.log('  --no-nativewind Skip NativeWind setup (default)');
  console.log('  --version, -v   Show version number');
  console.log('');
  console.log('Examples:');
  console.log('  rn-create my-app');
  console.log('  rn-create my-app --no-install');
  console.log('  rn-create my-app --template tabs');
  console.log('  rn-create my-app --nativewind');
  console.log('  rn-create --version');
  process.exit(0);
}

const projectName = args[0];
const options = args.slice(1);

// Validate project name (skip if first arg is a flag)
if (!projectName || projectName.startsWith('-')) {
  // If it's a version flag, it should have been caught above, but double-check
  if (projectName === '--version' || projectName === '-v') {
    console.log(version);
    process.exit(0);
  }
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
