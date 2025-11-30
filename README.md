# React Native Project CLI

A powerful CLI tool for creating React Native/Expo projects with optional NativeWind/TailwindCSS setup, optimized for WebStorm integration.

## Installation

### Global Installation (Recommended)

```bash
npm install -g rn-project-cli
```

### Local Installation

```bash
# Clone or download this repository
cd rn-project-cli
npm install
npm install -g .
```

### Quick Install (Windows - One-Click)

1. **Double-click `install.bat`** - This will install the CLI globally
2. Or run manually: `npm install -g .`

## Updating the Package

To update to the latest version of `rn-project-cli`:

### Update to Latest Version

```bash
npm install -g rn-project-cli@latest
```

Or simply:

```bash
npm update -g rn-project-cli
```

### Check Current Version

```bash
npm list -g rn-project-cli
```

Or check the version from the CLI:

```bash
rn-create --version
```

### Update to Specific Version

```bash
npm install -g rn-project-cli@1.0.2
```

### Verify Update

After updating, verify the installation:

```bash
rn-create
```

You should see the help message with the latest features.

## Usage

### Basic Usage

```bash
# Create a new Expo project
rn-create my-app

# The CLI will prompt you to setup NativeWind/TailwindCSS
# Answer 'yes' or 'no' when prompted
```

### Command Line Options

```bash
# Skip npm install (faster project creation)
rn-create my-app --no-install

# Use a specific template
rn-create my-app --template tabs

# Automatically setup NativeWind/TailwindCSS (skip prompt)
rn-create my-app --nativewind

# Skip NativeWind setup (skip prompt)
rn-create my-app --no-nativewind

# Combine options
rn-create my-app --template tabs --nativewind
rn-create my-app --template blank --no-install --no-nativewind
```

### NativeWind/TailwindCSS Setup

The CLI can automatically set up NativeWind and TailwindCSS for your project. When you run `rn-create`, you'll be prompted:

```
? Would you like to setup NativeWind/TailwindCSS? (y/N)
```

If you answer **yes**, the CLI will:
- ✅ Install `nativewind` and `tailwindcss` packages
- ✅ Create `tailwind.config.js` with proper configuration
- ✅ Create `global.css` with Tailwind directives
- ✅ Update `babel.config.js` with NativeWind plugin
- ✅ Update `metro.config.js` with CSS transformer
- ✅ Import `global.css` in your root component

**Usage Example:**
```jsx
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">
        Hello NativeWind!
      </Text>
    </View>
  );
}
```

### Batch File (WebStorm Compatible)

You can also use the batch file directly:

```bash
rn-create.bat my-app
rn-create.bat my-app --no-install
rn-create.bat my-app --template tabs
rn-create.bat my-app --nativewind
```

## Publishing to npm

To publish this package to npm:

1. **Update package.json** (if needed):
   - Set your name/email in `author` field
   - Update `repository.url` with your git repository
   - Bump version number

2. **Login to npm**:
   ```bash
   npm login
   ```

3. **Publish**:
   ```bash
   npm publish
   ```

4. **After publishing**, users can install globally:
   ```bash
   npm install -g rn-project-cli
   ```

## WebStorm Setup

### Option 1: External Tool (Recommended)

1. Open WebStorm
2. Go to **File → Settings → Tools → External Tools**
3. Click **+** to add a new tool
4. Configure:
   - **Name**: `Create React Native Project`
   - **Description**: `Create a new React Native/Expo project`
   - **Program**: `rn-create` (if installed globally) or path to `rn-create.bat`
   - **Arguments**: `$Prompt$`
   - **Working directory**: `$ProjectFileDir$`
5. Click **OK**

**Usage in WebStorm:**
- Right-click in Project Explorer → **External Tools → Create React Native Project**
- Enter project name when prompted (e.g., `my-app` or `my-app --nativewind`)

### Option 2: Run Configuration

1. Go to **Run → Edit Configurations**
2. Click **+ → Shell Script**
3. Configure:
   - **Name**: `Create RN Project`
   - **Script path**: Path to `rn-create.bat` or `rn-create` command
   - **Script options**: `$Prompt$`
   - **Working directory**: `$ProjectFileDir$`

## Command Options

- `--no-install`: Skip automatic npm install (useful for faster project creation)
- `--template <name>`: Use a specific Expo template (blank, tabs, etc.)
- `--nativewind`: Automatically setup NativeWind/TailwindCSS (skip interactive prompt)
- `--no-nativewind`: Skip NativeWind setup (skip interactive prompt)

## Examples

```bash
# Basic project (will prompt for NativeWind)
rn-create uber_clone

# Skip install for faster setup
rn-create uber_clone --no-install

# Use tabs template with NativeWind
rn-create my-app --template tabs --nativewind

# Full example
rn-create uber_clone --template blank --no-install --nativewind

# Skip NativeWind setup
rn-create my-app --no-nativewind
```

## Troubleshooting

### CLI not found after installation

If `rn-create` command is not found:
1. Make sure Node.js global bin directory is in your PATH
2. Or use `rn-create.bat` directly instead
3. Try: `npm config get prefix` to find global install location

### Permission errors

If you get permission errors during installation:
- Run `install.bat` as Administrator
- Or run: `npm install -g .` as Administrator
- On macOS/Linux: Use `sudo npm install -g .`

### NativeWind not working

If NativeWind classes aren't working:
1. Make sure `global.css` is imported in your root component
2. Check that `babel.config.js` includes `'nativewind/babel'` plugin
3. Verify `metro.config.js` has `cssToReactNativeRuntime: true`
4. Restart Metro bundler: `npx expo start --clear`

## Notes

- Projects are created in the current working directory
- The tool automatically validates project names and checks for existing directories
- NativeWind setup works with both JavaScript and TypeScript projects
- The CLI automatically detects your project structure (App.js, App.tsx, app/_layout.tsx, etc.)

## License

MIT
