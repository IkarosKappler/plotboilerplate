#!/bin/sh

echo "Compile ..."
npm run webpack
[ $? -eq 0 ]  || exit 1

echo "Publish ..."
npm publish
