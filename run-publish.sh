#!/bin/bash

# Define some colors
_RED='\033[0;31m'
_GREEN='\033[0;32m'
_PURPLE='\033[0;35m'
_GREY="\033[0;37m"
_YELLOW="\033[0;33m"
_NC='\033[0m'


while true; do
    read -p "Do you really want to publish the new version? webpack and jekyll will be run again in this process. (y/n)? " yn
    case $yn in
        [Yy]* ) echo "Failsafe."; break;;
        [Nn]* ) break;; #exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

echo "Retrieving latest published version number"
# PUBLIC_VERSION="1.7.9"
PUBLIC_VERSION=$(npm view plotboilerplate version)
LOCAL_VERSION=$(./run-get-package-version.sh)
echo "PUBLIC_VERSION: $PUBLIC_VERSION"
echo "LOCAL_VERSION: $LOCAL_VERSION"
if [ "$PUBLIC_VERSION" == "$LOCAL_VERSION" ]; then
    echo -e "${_RED}Cannot publish version. Local and public version are equal.${_NC}"
    exit 1
elif [ "$PUBLIC_VERSION" \> "$LOCAL_VERSION" ]; then
    echo -e "${_RED}Cannot publish version. Local version is lower than public version.${_NC}"
    exit 1
fi

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


echo "Creating the npm package"
$(run-mk-npm-package)
[ $? -eq 0 ]  || exit 1


echo "${_YELLOW}Exiting here ... TEST only${_NC}"
exit 2

echo "Publish ..."
cd "./npm-package" && npm publish

if [ $? -eq 0 ]; then
    echo ""
    echo "Ooops, something failed."
else
    echo ""
    echo -e "${_GREEN} !!! Don't forget to upload the compiled package to your staging environment !!! ${_NC}"
fi
    
