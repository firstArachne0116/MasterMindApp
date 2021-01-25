# MasterMind

This is the react-native codebase for the Master Mind application.

## Run locally

1. Run `npm install`
2. Run `cd ios && pod install` to install iOS native libraries
  - Need CocoaPods installed. Install it globally with `brew install cocoapods`
3. Run `npm start` on a separate terminal to start the package server
4. Run `react-native run-ios` to start an iOS simulator

## Deploy
Currently, we use [Bitrise](https://www.bitrise.io/) (pw in Keyweb) for deployments to Apple's "App Store" (iOS) and Google's "Play Store" (Android).

Warning: The `incrementBuild` command can't update String instances of the version. Failing to update all instances of the version will result in Apple or Google rejecting the app binary.

1. Run `npm run incrementBuild`
2. Open `src/config.js` and manually increment the `BUILD` and `VERSION` strings in the `baseConfig`:
```
const baseConfig = {
  VERSION : 'v0.1.1',
  BUILD : '10',
  SYSTEM_ID : 'imagineSystemId',
  PROJECT_ID : 'imagineProjectId',
}
```
3. Open `android/app/build.gradle`. Manually update the `versionName` string:
```
defaultConfig {
    applicationId "com.mastermind"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 10
    versionName "v0.1.1 build 10"
}
```
4. Open `android/app/src/main/AndroidManifest.xml`. Manually update the `android:versionCode` and `android:versionName` strings:
```
<manifest 
  xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.mastermind"
  android:versionCode="10" 
  android:versionName="v0.1.1 build 10">
```
5. Increment the value of the `CFBundleShortVersionString` in `ios/mastermind/Info.plist`
6. Increment version in `package.json` if it's a new version
7. Ensure that all the version / build codes that `incrementBuild` automagically incremented actually did increment.
8. Commit these changes to your branch and push to the branch's remote.
9. Go to [Bitrise's dashboard](https://app.bitrise.io/dashboard) (credentials in Keyweb)
10. Open the `mastermind-native-ui` app.
11. Click on "Start/Schedule a Build"
12. Enter your branch name into the Branch field
13. Type in the new version name into the Message field
14. Select the `deploy-ios` workflow for iOS to deploy to iOS
15. Repeat steps 7, 8, and 9, and then select the `deploy-android` workflow to deploy to Android

## Design Docs
* Prototype [here](https://www.figma.com/file/fL9oKROriFh28waJyX89tk/%5BKudelski%5D-mastermind-Mobile-App---For-Dev?node-id=0%3A1)

## Points of Contact
* Project Managment Lead: Hannah Sloan
* Design Lead: Mona  Bazzaz
* Development Lead: Michael Wedd
* Developers: Michael Jin

## Troubleshooting 

## Fix build issues running locally
If you run into build errors, follow the below steps in turn, stopping when you're able to successfully build the app:

1. Restart the packager server (Metro/Haste)
2. Use these terminal commands in the UI repo root to clear react and packager server caches:
```
watchman watch-del-all
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/haste-*
rm -rf $TMPDIR/metro-*
```
3. Open XCode and hold the keys `Cmd + Shift + K` to clean the project
