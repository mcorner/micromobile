# Installation

## Basics

  npm install -g cordova browserify cordova-icon
  npm install
  npm install -g less less-plugin-clean-css

## Deploy backend

  See micromobile backend repository for instructions

## Install Android tools

  https://developer.android.com/studio/index.html

## Install iOS tools

  Install xcode, etc.  Probably need more here.

## Prepare and build

  cordova prepare android ios browser
  cordova run android  (or ios or browser...)  

## Refresh plugin

   cordova plugin rm phonegap-plugin-push && cordova plugin add https://github.com/mcorner/phonegap-plugin-push.git

## Install branch of micromobile-lib

  npm install git+https://github.com/mcorner/micromobile-lib.git#compression-and-incremental --save

# Configuration

Change the values in config.xml for your appname, your email, etc.  You also need to configure branch in here.

Configure aws_config.sh with your AWS details

Copy config.json.sample to config.json.  Then configure with your own AWS Gateway hostname

Fill in your informed consent information in the informed consent Component

# Deploy

## Web version

### Setup for AWS

* aws --profile PUT_PROFILE_HERE s3api put-bucket-policy  --bucket micromobile  --policy '{"Version":"2012-10-17","Statement":[{"Sid":"PublicReadForGetBucketObjects","Effect":"Allow","Principal": "*","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::PUT_BUCKET_HERE/*"]}]}'
* aws --profile PUT_PROFILE_HERE s3 sync base/platforms/browser/www s3://PUT_BUCKET_HERE/


Build:

  CORDOVA_ENV=production cordova run browser --browserify

Sync to an s3 bucket (set up a cloudfront distribution to front this)

  scripts/deploy_web.sh

## iOS app

  You need a GoogleService-Info.plist for google services

## Android app

  Generate a keystore for release in my-release-key.keystore

  You need a GoogleService-Info.json for google services

  keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

  cordova build --release android

  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name

  ~/Library/Android/sdk/build-tools/25.0.3/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/android-release.apk
