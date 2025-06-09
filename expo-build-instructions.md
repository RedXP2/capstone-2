# Expo Build Instructions for Google Play Store

## Option 1: Using Expo's Classic Build Service

This is the simplest approach and doesn't require EAS:

1. Run the following command:
   ```
   npx expo build:android -t apk
   ```

2. Follow the prompts to create a keystore or use an existing one
   - Let Expo handle the keystore for simplicity

3. Wait for the build to complete (this may take 10-15 minutes)

4. Download the APK from the provided URL

5. Upload the APK to Google Play Store

## Option 2: Using Expo Application Services (EAS)

If you want to try EAS again:

1. Make sure you're logged in:
   ```
   npx eas-cli login
   ```

2. Create a new build:
   ```
   npx eas-cli build --platform android --profile preview
   ```

3. If you encounter the "Invalid UUID appId" error again, try:
   ```
   npx eas-cli build:configure
   ```
   followed by:
   ```
   npx eas-cli build --platform android --profile preview --non-interactive
   ```

## Uploading to Google Play Store

1. Create a Google Play Developer account ($25 one-time fee)
2. Create a new app in the Google Play Console
3. Set up your store listing with:
   - App name, description, and screenshots
   - Content rating questionnaire
   - Privacy policy URL
4. Upload your APK to the "Production" track
5. Submit for review

## Troubleshooting

If you continue to have issues with EAS builds, the classic build service (`expo build:android`) is a reliable alternative that should work without requiring local Android SDK or Java installation.