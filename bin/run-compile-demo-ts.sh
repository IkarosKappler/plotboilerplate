#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Please specify a demo path, e.g. \"demos/46-simple-audio-control\""
    exit 1
fi


demopath=$1
# Warning: here is no trailing slash guaranteed
demopath=$(realpath -s "../${demopath}/")
echo "Compiling files in ${demopath}/src/ts/"

pwd

# npx tsc --outDir demos/46-simple-audio-control/src/js/ demos/46-simple-audio-control/src/ts/*.ts
# npx tsc --target es5 --sourceMap --declaration --module commonjs --outDir "${demopath}/src/js/" "${demopath}/src/ts/"*.ts
npx tsc --target es5 --sourceMap --declaration --module commonjs --outDir "${demopath}/src/js/" "${demopath}/src/ts/"*.ts

# cd "${demopath}/src/ts/"
# pwd
# npx tsc --target es5 --sourceMap --declaration --module commonjs --outDir "../js/" "${demopath}/src/ts/"*.ts
