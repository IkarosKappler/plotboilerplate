#!/bin/bash

# This command creates markdown code which can be translated by Jekyll. Unfortunately my CSS is
# much uglier than that shiny default CSS theme from the typedoc generator.
# npx typedoc --out ../docs_jekyll/docs_typedoc_md --mode file ../src/ts --plugin typedoc-plugin-markdown --hideProjectName=false --hideBreadcrumbs=false --publicPath=https:\/\/plotboilerplate.io\/ --namedAnchors=false

# So just generate HTML output and display it in an iframe (see ../docs_jekyll/_layouts/docs.html)
npx typedoc --options typedoc-config.json


# The code below would generate markdown output
TARGET_DIR="../docs_jekyll/docs_typedoc_md_wheaders"
if [ ! -d "$TARGET_DIR" ]; then
    echo "Creating target dir $TARGET_DIR"
    mkdir -p "$TARGET_DIR"
fi

# Attach my markdown header to all files
function addMarkdownHeader() {
    d="$1"
    echo "Dir=$d"
    if [ -d "$d" ]; then

	for file in "$d"*; do
	    echo "Processing entry $file ..."
	    if [ -d "$file" ]; then
		echo "Recursion ..."
		addMarkdownHeader "$file/"
	    elif [ -f "$file" ]; then
		baseName=$(basename $file);
		outFile="$TARGET_DIR/$baseName"
		echo "Handing file $file and printing to $outfile ..."
		echo '---' > $outFile
		echo 'layout: docs' >> $outFile
		# echo 'permalink: /demos/' >> $outFile
		date +'date: %Y-%m-%d' >> $outFile
		echo '---' >> $outFile
		echo '' >> $outFile
		cat "$file" >> $outFile

	    fi
	done
    else
	echo "Warning: file $d is not a directory! Skipping"
    fi
}
# addMarkdownHeader "../docs_jekyll/docs_typedoc_md/" 
