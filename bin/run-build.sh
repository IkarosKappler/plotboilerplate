#!/bin/sh

# cd .. && npm run compile-typescript-browser
cd .. && npm run build

[ $? -eq 0 ]  || exit 1

cd bin

# echo "Running webpack-dev ..."
# npx webpack --config ./webpack5-dev.config.js

# echo "Running webpack-prod (browser) ..."
# npx webpack --config ./webpack5.browser.config.js

# cd .. && npm run compile-typescript-module

# echo "Running rollup (module) ..."
# npm run rollup-module


