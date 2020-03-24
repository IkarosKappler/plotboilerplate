// Get the URI GET params as an assoc.
// 
// A nice version with regex
// Found at
//    https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
//
// Typescript version by Ikaros Kappler, 2020-03-24
// 
var gup = function () {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (substring) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var key = args[0], value = args[1];
        vars[key.toString()] = value.toString();
        return substring;
    });
    return vars;
};
