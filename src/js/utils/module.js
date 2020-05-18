/**
 * Javacript modules transpiled from Typescript may contain
 * export and required directives, which are no native components
 * in the browser.
 *
 *  > Uncaught ReferenceError: exports is not defined
 *  > Uncaught ReferenceError: require is not defined
 *
 * These two instructions create fake 'require' and fake 'export'
 * which should fix thede problems.
 *
 * @date 2020-04-01
 **/

//var exports = window.export = [];
var exports = window.export = window; // [];
var require = window.require = function(...args) { return window; };
