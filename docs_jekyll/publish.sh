#!/bin/bash

echo "Copying screenshots ... "
cp -R ../screenshots/ .

echo "Building markdown page from template and readme ..."
echo '---' > index.md
echo 'layout: home' >> index.md
echo 'date: 2019-03-11' >> index.md
echo '---' >> index.md
cat ../README.md >> index.md
echo '## Changelog' >> index.md
echo '[View changelog](changelog.html "View changelog")' >> index.md

# cat __partials/index-head.partial.html ../README.md __partials/index-foot.partial.html > index.md

echo "Building the changelog file ..."
echo '---' > changelog.md
echo 'layout: page' >> changelog.md
echo 'title: Changelog' >> changelog.md
echo '---' >> changelog.md
cat ../changelog.md >> changelog.md

echo "Starting jekyll ..."
bundle exec jekyll serve

# Do not start with 'serve' if you want to compile for production!
# bundle exec jekyll build
