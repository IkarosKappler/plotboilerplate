// @deprecated: use ../src/{js,ts}/utils/algorithms/getContrastColor instead.
function getContrastColor(tinyColor){
    
    /*
      Found ate codepen by David Halford
      https://codepen.io/davidhalford/pen/ywEva

      From this W3C document: http://www.w3.org/TR/AERT#color-contrast
      
      Color brightness is determined by the following formula: 
      ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
      
      I know this could be more compact, but I think this is easier to read/explain.  
    */
    
    threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

    // console.log( tinyColor.r );
    hRed = tinyColor.r*255; // hexToR(hex);
    hGreen = tinyColor.g*255; // hexToG(hex);
    hBlue = tinyColor.b*255; // hexToB(hex);
    
    
    //function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
    //function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
    //function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
    //function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

    cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) 
	return "#000000";
    else
	return "#ffffff";	
}
