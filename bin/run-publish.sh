#!/bin/bash

# Define some colors
_RED='\033[0;31m'
_GREEN='\033[0;32m'
_PURPLE='\033[0;35m'
_GREY="\033[0;37m"
_YELLOW="\033[0;33m"
_NC='\033[0m'


while true; do
    echo -e "${_PURPLE}Do you really want to publish the new version?${_NC}"
    read -p "webpack and jekyll will be run again in this process. (y/n)? " yn
    case $yn in
        [Yy]* ) echo "Failsafe."; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

echo "Retrieving latest published version number"
# PUBLIC_VERSION="1.7.9"
PUBLIC_VERSION=$(npm view plotboilerplate version)
LOCAL_VERSION=$(./run-get-package-version.sh)
echo "PUBLIC_VERSION: $PUBLIC_VERSION"
echo "LOCAL_VERSION: $LOCAL_VERSION"

# Found at
#   https://stackoverflow.com/questions/4023830/how-to-compare-two-strings-in-dot-separated-version-format-in-bash
vercomp () {
    if [[ $1 == $2 ]]
    then
        return 0
    fi
    local IFS=.
    local i ver1=($1) ver2=($2)
    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++))
    do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++))
    do
        if [[ -z ${ver2[i]} ]]
        then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]}))
        then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]}))
        then
            return 2
        fi
    done
    return 0
}


if [ "$PUBLIC_VERSION" == "$LOCAL_VERSION" ]; then
    echo -e "${_RED}Cannot publish version. Local and public version are equal.${_NC}"
    exit 1
else
    vercomp "$PUBLIC_VERSION" "$LOCAL_VERSION"
    case $? in
        0) op='=';;
        1) op='>';;
        2) op='<';;
    esac
    if [[ $op = ">" ]]
    then
	echo -e "${_RED}Cannot publish version. Local version is lower than public version.${_NC}"
	exit 1
    fi
fi

./run-build.sh

[ $? -eq 0 ]  || exit 1
git add dist/plotboilerplate.min.js
git add dist/plotboilerplate.js
git commit -m "Automatic commit."


if [[ `git status --porcelain --untracked-files=no` ]]; then
    echo -e "${_RED}It seems your local git repository has uncommited changes. Please commit them before publishing.${_NC}"
    exit 1
else
  echo "Your local git repository looks clean."
fi


echo "Creating the npm package"
./run-mk-npm-package.sh
[ $? -eq 0 ]  || exit 1


# echo -e "${_YELLOW}Exiting here ... TEST only${_NC}"
# exit 2

echo "Publish ..."
cd ../npm-package && npm publish

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${_GREEN} !!! Don't forget to upload the compiled package to your staging environment !!! ${_NC}"
else
    echo ""
    echo "Ooops, something failed."
fi

