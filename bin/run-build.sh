#!/bin/sh

# ./run-compile-typescript.sh
cd .. && npm run compile-typescript-browser

[ $? -eq 0 ]  || exit 1

cd bin

echo "Running webpack-dev ..."
npx webpack --config ./webpack5-dev.config.js

echo "Running webpack-prod (browser) ..."
npx webpack --config ./webpack5.browser.config.js

# echo "Running webpack-prod (module) ..."
# npx webpack --config ./webpack5.module.config.js

cd .. && npm run compile-typescript-module

echo "Running rollup (module) ..."
npm run rollup-module
