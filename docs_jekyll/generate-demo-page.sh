#!/bin/bash


function mkDemoPage() {
    # Read tracker code into file
    if [ ! -d ../demos/ ]; then
	echo "WARN No ../demo/ directory found."
	return
    fi

    # With trailing slash
    demoDir="../demos/"
    outFile='demos.md'
    echo "Building demo page from $demoDir directory ..."

    echo '---' > $outFile
    echo 'layout: demos' >> $outFile
    date +'date: %Y-%m-%d' >> $outFile
    echo '---' >> $outFile
    echo '' >> $outFile
    
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
		# href="{{ my_page.url | prepend: site.baseurl }}"
		echo "<div class=\"demo-box\">" >> $outFile
		echo "   <a class=\"no-decoration\" href=\"{{ '/repo/demos/$baseName/index.html' | prepend: site.url }}\">" >> $outFile
		echo "      <div style=\"background-image: url('$imgSrc');\"></div>" >> $outFile
		echo "   </a>" >> $outFile
		echo "</div>" >> $outFile
		
		
	    fi
	fi
    done
    echo '</div>' >> $outFile
}

mkDemoPage
