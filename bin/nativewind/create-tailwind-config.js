const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Creates tailwind.config.js file
 * @param {string} projectPath - Path to the project directory
 */
function createTailwindConfig(projectPath) {
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
}

module.exports = createTailwindConfig;

