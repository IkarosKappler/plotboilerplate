#!/bin/bash

cp -R ../screenshots/ .

cat __partials/index-head.partial.html ../README.md __partials/index-foot.partial.html > index.md

echo '---' > changelog.md
echo 'layout: page' >> changelog.md
echo '---' >> changelog.md
cat ../changelog.md >> changelog.md

echo "Starting jekyll ..."
# bundle exec jekyll serve

# Do not start with 'serve' if you want to compile for production!
bundle exec jekyll build
