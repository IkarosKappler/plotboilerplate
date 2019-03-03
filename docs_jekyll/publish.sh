#!/bin/bash

required_files=(howto-generate-docs.txt README.md)
required_dirs=(screenshots)

# Check if the assets link exists
if [ ! -d _includes/_assets ]; then
   echo "Resoure directory _includes/_assets doesn't exist. Creating ..."
   mkdir _includes/_assets
   echo "Done."
fi

echo "Checking for resource files ..."
for file in "${required_files[@]}"
do
   : 
   # do whatever on $file
   # echo $file
   if [ ! -f _includes/_assests/$file ]; then
       echo "Copy of file $file doesn't exist. Creating ..."
       cp ../$file _includes/_assets
       echo "Done."
   fi
done

echo "Checking dirs ..."
for dir in "${required_dirs[@]}"
do
   : 
   # do whatever on $dir
   # echo $dir
   echo "Copy of dir $file doesn't exist. Creating ..."
   cp -R ../$dir .
   echo "Done."
done

echo "Starting jekyll ..."
bundle exec jekyll serve
