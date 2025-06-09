# Fix Expo Issues

Run these commands in order to fix the issues identified by `expo doctor`:

## 1. Fix package version conflicts

```bash
npx expo install --check
```

This will update all packages to versions compatible with your Expo SDK.

## 2. Fix app.json and app.config.js conflict

Since you have both app.json and app.config.js, you need to choose one approach:

Option A: Remove app.json (recommended)
```bash
del app.json
```

Option B: Update app.config.js to use app.json values
```javascript
// app.config.js
import { getConfig } from '@expo/config';

// Get values from app.json
const config = getConfig(__dirname);

export default {
  ...config.exp,
  // Your overrides here
  android: {
    package: "com.redxp.musclerecoveryapp",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#4CAF50"
    },
    edgeToEdgeEnabled: true
  }
};
```

## 3. Fix prebuild configuration issue

Create or update .gitignore to include native folders:

```bash
echo "/android" >> .gitignore
echo "/ios" >> .gitignore
```

## 4. Fix unmaintained package

Replace expo-random with a maintained alternative:

```bash
npm uninstall expo-random
npx expo install expo-crypto
```

## 5. Build with EAS

After fixing these issues, try building again:

```bash
npx eas build -p android --profile production
```

If you continue to have issues, try the classic build approach:

```bash
npx expo-cli build:android -t app-bundle
```