/**
 * Get a formatted `YYYMMDD-HHiiss` date string ... like for filenames and such.
 *
 * @date 2020-12-28
 */

var getFormattedTime = function() {
    var today = new Date();
    var y = today.getFullYear();
    // JavaScript months are 0-based.
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var h = today.getHours();
    var mi = today.getMinutes();
    var s = today.getSeconds();
    return "" + y + (m<10?'0':'') + m + (d<10?'0':'') + d + "-" + (h<10?'0':'')+h + "" + (mi<10?'0':'')+mi + (s<10?'0':'')+s;
};
