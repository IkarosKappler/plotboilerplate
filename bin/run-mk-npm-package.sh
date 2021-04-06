#!/bin/bash

# Define some colors
_RED='\033[0;31m'
_GREEN='\033[0;32m'
_PURPLE='\033[0;35m'
_GREY="\033[0;37m"
_YELLOW="\033[0;33m"
_NC='\033[0m'


TARGET_DIR="../npm-package/"


# Copy all required files to the target package
# (I do not want to publish my whole compiler setup to npmjs, only the production files)
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${_PURPLE} *** Creating target directory '$TARGET_DIR'${_NC}"
    mkdir "$TARGET_DIR"
else
    echo -e "${_PURPLE} *** Target directory '$TARGET_DIR' already exists, no need to create it.${_NC}"
fi;


# Check git repository
if [ ! -d "$TARGET_DIR.git" ]; then
    echo -e "${_PURPLE} *** Creating git repository"
    cd "$TARGET_DIR" && git init && cd ..
    [ $? -eq 0 ]  || exit 1
    echo -e "${_PURPLE} *** Creating .gitignore file${_NC}"
    echo "*~" > "$TARGET_DIR.gitignore"
    echo "_*" >> "$TARGET_DIR.gitignore"
else
    echo -e "${_PURPLE} *** git repository already exists, no need to create it.${_NC}"
fi


echo -e "${_PURPLE} *** Copying files for minimal package ... ${_NC}"
# (no docs, no demos, no jekyll, no config files, no screenshots)
cp ../README.md "$TARGET_DIR"README.md
cp ../changelog.md "$TARGET_DIR"changelog.md
cp ../basics.md "$TARGET_DIR"basics.md
cp ../package.json "$TARGET_DIR"package.json
cp -r ../src/ "$TARGET_DIR"
cp -r ../dist/ "$TARGET_DIR"
cp ../main-dist.html "$TARGET_DIR"main-dist.html
cp ../main.html "$TARGET_DIR"main.html
cp ../main-svg.html "$TARGET_DIR"main-svg.html
cp ../style.css "$TARGET_DIR"style.css
cp ../example-image.png "$TARGET_DIR"example-image.png
cp ../LICENSE "$TARGET_DIR"LICENSE

BUILDDATE=$(date)
echo -e "$BUILDDATE" > "$TARGET_DIRbuilddate"


echo -e "${_PURPLE} *** Commiting the files to the new package${_NC}"
cd "$TARGET_DIR" && git add .gitignore * && git commit -m "Auto-commit $BUILDDATE"


