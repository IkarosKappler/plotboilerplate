#!/bin/sh

./run-compile-typescript.sh

[ $? -eq 0 ]  || exit 1

echo "Running webpack ..."
npm run webpack
