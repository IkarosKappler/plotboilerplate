#!/bin/bash

TARGET_DIR="./npm-package/"


# Copy all required files to the target package
# (I do not want to publish my whole compiler setup to npmjs, only the production files)
if [ ! -d "$TARGET_DIR" ]; then
    echo " *** Creating target directory '$TARGET_DIR'"
    mkdir "$TARGET_DIR"
else
    echo " *** Target directory '$TARGET_DIR' already exists, no need to create it."
fi;


# Check git repository
if [ ! -d "$TARGET_DIR/.git" ]; then
    echo " *** Creating git repository"
    cd "$TARGET_DIR" && git init && cd ..
    [ $? -eq 0 ]  || exit 1
    echo "Creating .gitignore file"
    echo "*~" >> "$TARGET_DIR/.gitignore"
else
    echo " *** git repository already exists, no need to create it."
fi


echo "Copying files for minimal package ... "
# (no docs, no demos, no jekyll, no config files, no screenshots)
cp README.md "$TARGET_DIR/"REAME.md
cp changelog.md "$TARGET_DIR/"changelog.md
cp basics.md "$TARGET_DIR/"basics.md
cp package.json "$TARGET_DIR/"package.json
cp -r src/ "$TARGET_DIR/"
cp -r dist/ "$TARGET_DIR/"
cp main-dist.html "$TARGET_DIR/"main-dist.html
cp main.html "$TARGET_DIR/"main.html
cp style.css "$TARGET_DIR/"style.css
cp example-image.png "$TARGET_DIR/"example-image.png
cp license.txt "$TARGET_DIR/"license.txt

BUILDDATE=$(date)
echo "$BUILDDATE" >> "$TARGET_DIR/builddate"


echo " *** Commiting the files to the new package"
cd "$TARGET_DIR/" && git add * && git commit -m "Auto-commit $BUILDDATE"


