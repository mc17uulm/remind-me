#!/usr/bin/env sh

rm wp-reminder.zip

zip -qqr assets.zip .wordpress/
mkdir .build
cp -r dist .build/
cp -r languages .build/
cp -r plugin .build/
cp -r schemas .build/
cp -r vendor .build/
cp composer.json .build/
cp composer.lock .build/
cp wp-reminder.php .build/
touch .build/log.txt
zip -qqr plugin.zip .build/
zip -qq wp-reminder.zip assets.zip plugin.zip

rm -rf .build
rm assets.zip
rm plugin.zip