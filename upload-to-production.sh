#!/bin/bash


# Load up .env
set -o allexport
[[ -f .env ]] && source .env
set +o allexport

echo "Uploading to $server ..."

# rsync -avH ./docs_jekyll/_site/*  -e ssh user@server:/your/destination/path
rsync -avH ./docs_jekyll/_site/* -e ssh $user@$server:$destination
rsync -avH ./demos               -e ssh $user@$server:"$destination/repo/"
rsync -avH ./dist                -e ssh $user@$server:"$destination/repo/"
rsync -avH ./lib                 -e ssh $user@$server:"$destination/repo/"
rsync -avH ./screenshots         -e ssh $user@$server:"$destination/repo/"
rsync -avH ./src                 -e ssh $user@$server:"$destination/repo/"
rsync -avH ./tests               -e ssh $user@$server:"$destination/repo/"
