#!/bin/bash

# Define some colors
_RED='\033[0;31m'
_GREEN='\033[0;32m'
_PURPLE='\033[0;35m'
_GREY="\033[0;37m"
_YELLOW="\033[0;33m"
_NC='\033[0m'


TARGET_DIR="./npm-package/"


# Copy all required files to the target package
# (I do not want to publish my whole compiler setup to npmjs, only the production files)
if [ ! -d "$TARGET_DIR" ]; then
    echo " --- Creating target directory '$TARGET_DIR'"
    mkdir "$TARGET_DIR"
else
    echo " --- Target directory '$TARGET_DIR' already exists, no need to create it."
fi;


# Check git repository
if [ ! -d "$TARGET_DIR/.git" ]; then
    echo " --- Creating git repository"
    cd "$TARGET_DIR" && git init && cd ..
    [ $? -eq 0 ]  || exit 1
else
    echo " --- git repository already exists, no need to create it."
fi;


# Copy all required files
cp README.md "$TARGET_DIR/"REAME.md
cp package.json "$TARGET_DIR/"package.json
cp -r src/ "$TARGET_DIR/"
cp -r dist/ "$TARGET_DIR/"

