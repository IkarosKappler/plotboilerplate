#!/bin/sh

echo "Compiling Typescript ..."
npm run compile-typescript

[ $? -eq 0 ]  || exit 1

echo "Running webpack ..."
npm run webpack
