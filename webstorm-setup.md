# WebStorm Setup Guide

## Quick Setup (Recommended)

### Method 1: External Tool (Easiest)

1. **Open WebStorm Settings**
   - Press `Ctrl+Alt+S` or go to **File → Settings**

2. **Navigate to External Tools**
   - Go to **Tools → External Tools**
   - Click the **+** button to add a new tool

3. **Configure the Tool**
   ```
   Name: Create React Native Project
   Description: Create a new React Native/Expo project
   Program: C:\Users\faysa\rn-project-cli\rn-create.bat
   Arguments: $Prompt$
   Working directory: $ProjectFileDir$
   ```
   
   **Important Settings:**
   - ✅ Check "Open console" to see output
   - ✅ Check "Synchronize files after execution"

4. **Click OK** to save

### How to Use

1. Right-click in the **Project Explorer** (left sidebar)
2. Select **External Tools → Create React Native Project**
3. In the prompt, enter:
   - Just project name: `uber_clone`
   - With options: `uber_clone --no-install`
   - With template: `uber_clone --template tabs --no-install`

### Method 2: Keyboard Shortcut

1. After setting up the External Tool (Method 1)
2. Go to **File → Settings → Keymap**
3. Search for "Create React Native Project"
4. Right-click and assign a keyboard shortcut (e.g., `Ctrl+Alt+N`)

### Method 3: Run Configuration

1. Go to **Run → Edit Configurations**
2. Click **+ → Shell Script**
3. Configure:
   ```
   Name: Create RN Project
   Script path: C:\Users\faysa\rn-project-cli\rn-create.bat
   Script options: $Prompt$
   Working directory: $ProjectFileDir$
   ```
4. Save and use with `Shift+F10` or the Run button

## Example Usage

When prompted, you can enter:

```
uber_clone
```

Or with options:

```
uber_clone --no-install
```

Or with template:

```
uber_clone --template tabs --no-install
```

## Troubleshooting

### Tool not found
- Make sure the path `C:\Users\faysa\rn-project-cli\rn-create.bat` exists
- Check that the file has `.bat` extension

### Command fails
- Make sure Node.js is installed and accessible
- Check that `C:\Program Files\PhpWebStudy-Data\env\node\npx.cmd` exists
- Try running the batch file directly from command prompt first

### Project created but not visible
- Click the refresh button in Project Explorer
- Or use **File → Synchronize** (Ctrl+Alt+Y)
