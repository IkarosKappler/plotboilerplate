#!/bin/bash
#
# Generate a markdown document containing an overview of all
# available demo pages.
#
# The source files are located in the directories ../demos/*
#  * only directories are accepted
#  * directories starting with _* will be ignored
#  * directories starting with basic-* will be ignored
#
# Follwing header tags should be contained in each */index.html file
#  * <title>...</title>
#  * <meta property="og:image" content="..." >
#  * <meta property="og:description" content="..." >
#  * <meta property="og:title" content="..." >
#
# @date    2020-05-13
# @author  Ikaros Kappler
# @version 1.0.0

function mkDemoPage() {
    # Read tracker code into file
    if [ ! -d ../demos/ ]; then
	echo "WARN No ../demo/ directory found."
	return
    fi

    # With trailing slash
    demoDir="../demos/"
    outFile='demos.md'
	basicOutFileName='basic-demos.html'
	basicOutFile="_includes/$basicOutFileName"
    echo "Building demo page from $demoDir directory ..."

    echo '---' > $outFile
    echo 'layout: demos' >> $outFile
    echo 'permalink: /demos/' >> $outFile
    date +'date: %Y-%m-%d' >> $outFile
    echo '---' >> $outFile
    echo '' >> $outFile

	echo '' > $basicOutFile
    
	echo '<h3>Basics</h3>' >> $outFile
	echo '<div class="full-width basic-demos">' >> $outFile
	echo "   {% include $basicOutFileName %}" >> $outFile
	echo '</div>' >> $outFile

	echo '<h3>Enhanced</h3>' >> $outFile
    echo '<div class="full-width">' >> $outFile
    for d in "$demoDir"*; do
	if [ -d "$d" ]; then
	    if [ ! -f "$d/index.html" ]; then
		echo "WARN No '$d/index.html' file found."
	    else
		echo "Processing file $d/index.html ..."

		imgSrc=$(cat "$d/index.html" | sed -rn "/<meta .*property=.og:image./ s/.*content=.([^\"]+).*/\1/p")
		descr=$(cat "$d/index.html" | sed -rn "/<meta .*property=.og:description./ s/.*content=.([^\"]+).*/\1/p")
		title=$(cat "$d/index.html" | sed -rn "/<meta .*property=.og:title./ s/.*content=.([^\"]+).*/\1/p")
		htmlTitle=$(cat "$d/index.html" | sed -n 's/<title>\(.*\)<\/title>/\1/Ip')
		echo "    Source:    $imgSrc"
		echo "    Descr:     $descr"
		echo "    title:     $title"
		echo "    htmlTitle: $htmlTitle"

		baseName=$(basename $d);
		echo "baseName=$baseName"
		if [[ $baseName == _* ]]; then
		    echo "Ignoring underscore directory $d"
		elif [[ $baseName == basic-* ]]; then
		    echo "Processing the 'basics' directory $d"
			echo "<div class=\"demo-box-basic\">" >> $basicOutFile
		    echo "   <a class=\"no-decoration\" href=\"{{ '/repo/demos/$baseName/index.html' | prepend: site.url }}\">" >> $basicOutFile
		    echo "      <div style=\"background-image: url('$imgSrc');\"></div>" >> $basicOutFile
		    echo "   </a>" >> $basicOutFile
		    echo "</div>" >> $basicOutFile
		else
		    # href="{{ my_page.url | prepend: site.baseurl }}"
		    echo "<div class=\"demo-box\">" >> $outFile
		    echo "   <a class=\"no-decoration\" href=\"{{ '/repo/demos/$baseName/index.html' | prepend: site.url }}\">" >> $outFile
		    echo "      <div style=\"background-image: url('$imgSrc');\"></div>" >> $outFile
		    echo "   </a>" >> $outFile
		    echo "</div>" >> $outFile
		fi
		
	    fi
	fi
    done
    echo '</div>' >> $outFile
}

mkDemoPage
