#!/bin/bash

while true; do
    read -p "Do you really want to publish the new version? Did you run webpack? Did you run Jekyll? (y/n)? " yn
    case $yn in
        [Yy]* ) echo "Failsafe."; break;;
        [Nn]* ) break;; #exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

./run-build.sh

[ $? -eq 0 ]  || exit 1
git add dist/plotboilerplate.min.js
git add dist/plotboilerplate.js
git commit -m "Automatic commit."


if [[ `git status --porcelain --untracked-files=no` ]]; then
    echo "It seems your local git repository has uncommited changes. Please commit them before publishing."
    exit 1
else
  echo "Your local git repository looks clean."
fi


echo "Publish ..."
npm publish

echo ""
echo " !!! Don't forget to upload the compiled package to your staging environment !!!"
