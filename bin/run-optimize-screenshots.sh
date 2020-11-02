#!/bin/bash
#
# Reduces the color depth of all screenshots to 32 colors.
#
# Requires: imagemagick (convert command)
#
# ! Images must be PNGs !
#
# @date 2020-05-18
# @author Ikaros Kappler
 
# Define some colors
_RED='\033[0;31m'
_GREEN='\033[0;32m'
_PURPLE='\033[0;35m'
_GREY="\033[0;37m"
_NC='\033[0m'
 
 
# Take files from ../screenhots/screenshots-fullcolor/
# Output directory is ../screenshots/
 
 
 
# Iterate through all large start-JPG files.
# for file in "$dirname/"*.jpg; do 
for file in "../screenshots/screenshots-fullcolor/"*.{png,PNG}; do

    echo "FILE: $file"
    filename=$(basename "$file")
    
    # Process only regular files
    if [ -f "$file" ]; then
	
	echo -e "   ${_PURPLE}Generating optimized screensot for file ${filename} ${_NC}"
	# convert "$file" -resize 128 -define jpeg:extent=10kb "./$dirname_thumbs/$filename"
	convert -colors 32 "../screenshots/screenshots-fullcolor/$filename" "../screenshots/$filename"
	
	echo -e "   ${_GREEN}Done.${_NC}"

    fi
	
done
