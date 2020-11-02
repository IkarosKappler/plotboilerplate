#!/bin/sh

./run-compile-typescript.sh

[ $? -eq 0 ]  || exit 1

echo "Running webpack-dev ..."
npx webpack --config webpack5-dev.config.js

echo "Running webpack-prod ..."
npx webpack --config webpack5.config.js
