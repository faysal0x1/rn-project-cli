const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Installs NativeWind and TailwindCSS packages
 * @param {string} projectPath - Path to the project directory
 * @param {boolean} skipInstall - Whether to skip npm install
 */
function installPackages(projectPath, skipInstall) {
    if (!skipInstall) {
        console.log(chalk.gray('Installing NativeWind v4, TailwindCSS, and Reanimated...'));
        execSync('npm install nativewind@^4.0.1 tailwindcss@^3.3.2 react-native-reanimated', {
            stdio: 'inherit',
            cwd: projectPath,
            shell: true
        });
    } else {
        console.log(chalk.yellow('⚠ Skipping package installation. Run: npm install nativewind tailwindcss'));
    }
}

module.exports = installPackages;

