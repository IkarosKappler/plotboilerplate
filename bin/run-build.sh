#!/bin/sh

./run-compile-typescript.sh

[ $? -eq 0 ]  || exit 1

echo "Running webpack-dev ..."
npx webpack --config ./webpack5-dev.config.js

echo "Running webpack-prod (browser) ..."
npx webpack --config ./webpack5.browser.config.js

echo "Running webpack-prod (module) ..."
npx webpack --config ./webpack5.module.config.js
