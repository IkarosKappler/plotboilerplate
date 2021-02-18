/**
 * @author Ikaros Kappler
 * @date   2021-02-18 (day of the NASA probe 'Perseverance' landing on planet Mars)
 **/

var Interval = function( min, max ) {
    this.min = min;
    this.max = max;
    this.length = function() { return this.max-this.min; };
};
