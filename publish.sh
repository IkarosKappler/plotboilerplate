#!/bin/bash

echo "Compile ..."
npm run webpack
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
# npm publish
