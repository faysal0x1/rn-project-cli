const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Updates tsconfig.json to include nativewind-env.d.ts
 * @param {string} projectPath - Path to the project directory
 */
function updateTsConfig(projectPath) {
  const tsConfigPath = path.join(projectPath, 'tsconfig.json');
  
  if (!fs.existsSync(tsConfigPath)) {
    // Not a TypeScript project, skip
    return;
  }

  try {
    let tsConfig = fs.readFileSync(tsConfigPath, 'utf8');
    const tsConfigObj = JSON.parse(tsConfig);

    // Check if nativewind-env.d.ts is already included
    const includes = tsConfigObj.include || [];
    const hasNativeWindEnv = includes.some(inc => 
      typeof inc === 'string' && inc.includes('nativewind-env.d.ts')
    );

    if (!hasNativeWindEnv) {
      // Add nativewind-env.d.ts to include array
      if (!tsConfigObj.include) {
        tsConfigObj.include = [];
      }
      
      // Add it if not already there
      if (!tsConfigObj.include.includes('nativewind-env.d.ts')) {
        tsConfigObj.include.push('nativewind-env.d.ts');
      }

      // Write back with proper formatting
      const updatedTsConfig = JSON.stringify(tsConfigObj, null, 2);
      fs.writeFileSync(tsConfigPath, updatedTsConfig + '\n');
      console.log(chalk.green('✓ Updated tsconfig.json'));
    } else {
      console.log(chalk.gray('✓ tsconfig.json already includes nativewind-env.d.ts'));
    }
  } catch (error) {
    console.log(chalk.yellow('⚠ Could not update tsconfig.json. You may need to manually add "nativewind-env.d.ts" to the include array.'));
  }
}

module.exports = updateTsConfig;

