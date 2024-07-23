#!/bin/bash
#
# This script creates a zip package for downloading from the files in ../npm-package/.
# @author Ikaros Kappler
# @date 2021-04-12 (one day before ramadan)
# @version 1.0.0

# Define some colors
_RED='\033[0;31m'
_GREEN='\033[0;32m'
_PURPLE='\033[0;35m'
_GREY="\033[0;37m"
_YELLOW="\033[0;33m"
_NC='\033[0m'

# Create a zip file from release
LOCAL_VERSION=$(./run-get-package-version.sh)

SOURCE_DIR="../npm-package"
TARGET_DIR="../releases"

# Create dir if not exists
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${_PURPLE} *** Creating target directory '$TARGET_DIR'${_NC}"
    mkdir "$TARGET_DIR"
else
    echo -e "${_PURPLE} *** Target directory '$TARGET_DIR' already exists, no need to create it.${_NC}"
fi;

cd "$TARGET_DIR"


filename="plotboilerplate-${LOCAL_VERSION}.tar.gz"
n=0; 
while [ -f "$filename" ]; do ((++n));
    filename="plotboilerplate-${LOCAL_VERSION}-${n}.tar.gz"
    # echo $filename 
done; 

echo "Creating file ${filename} ..."

# Create zip file, excluding the .git directory
tar -czf "$filename" "${SOURCE_DIR}/"*
# tar -czf "$filename" "${SOURCE_DIR}/"* --exclude="${SOURCE_DIR}/.git"

# Create a copy for direct linking (website)
cp "$filename" "plotboilerplate-latest.tar.gz"
