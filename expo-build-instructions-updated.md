# Updated Expo Build Instructions

If you're encountering issues with the interactive prompts in PowerShell, here's how to build your app for the Google Play Store:

## Setting Up Build Credentials

Before building, you need to configure your Android build credentials:

1. Generate a keystore file (if you don't have one):
   ```
   npx eas credentials
   ```
   Or specifically for Android:
   ```
   npx eas credentials --platform android
   ```

2. Follow the interactive prompts to:
   - Create a new keystore
   - Set a keystore password
   - Set key alias and password

3. Alternatively, configure credentials in eas.json:
   ```json
   {
     "build": {
       "production": {
         "android": {
           "buildType": "app-bundle",
           "credentialsSource": "local"
         }
       }
     }
   }
   ```

## Option 1: Use Expo's Web Interface

1. Go to [https://expo.dev](https://expo.dev) and log in with your Expo account
2. Navigate to your project (now linked with ID: b18ebdc9-ca4d-42ad-8151-9ca0dddea9f1)
3. Click on "Build" in the left sidebar
4. Select "Android"
5. Choose "APK" or "App Bundle" (App Bundle is preferred for Play Store)
6. Follow the web interface prompts to complete the build

## Option 2: Use a Different Terminal

The issue appears to be with PowerShell not handling interactive prompts properly. Try:

1. Open Command Prompt (cmd.exe) instead of PowerShell
2. Navigate to your project directory:
   ```
   cd C:\Users\Willy\Downloads\Bootcamp\Assignments\Capstone Project 2
   ```
3. Run the build command:
   ```
   eas build -p android
   ```

## Option 3: Use Expo Classic Build

If you continue to have issues with EAS, try the classic build system:

1. Open Command Prompt (not PowerShell)
2. Run:
   ```
   npx expo-cli build:android -t app-bundle
   ```

## Memory Issues During Build

If you encounter "Fatal process out of memory" errors:

1. Increase Node.js memory limit:
   ```
   node --max-old-space-size=8192 node_modules/expo/bin/cli.js eas build -p android
   ```

2. Or build on Expo's servers instead of locally:
   ```
   npx eas build -p android --profile preview
   ```

## Google Play Store Submission

Once you have your APK or AAB file:

1. Create a Google Play Developer account ($25 one-time fee)
2. Create a new app in the Google Play Console
3. Upload your APK/AAB to the Production track
4. Complete the store listing with:
   - App name, description, and screenshots
   - Content rating questionnaire
   - Privacy policy URL
5. Submit for review

The review process typically takes 1-3 days.