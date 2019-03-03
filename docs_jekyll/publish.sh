#!/bin/sh

# Check if the assets link exists
if [ ! -L _assets ]; then
    echo "Resoure link doesn't exist. Creating ..."
    ln -s .. _assets
    echo "Done."
fi

echo "Starting jekyll ..."
bundle exec jekyll serve
