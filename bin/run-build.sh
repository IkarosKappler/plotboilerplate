#!/bin/sh

# cd .. && npm run compile-typescript-browser
cd .. && npm run build

[ $? -eq 0 ]  || exit 1

cd bin

