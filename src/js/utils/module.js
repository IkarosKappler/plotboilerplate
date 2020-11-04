/**
 * Javacript modules transpiled from Typescript may contain
 * `export` and `require` directives, which are no native components
 * in most common browsers.
 *
 *  > Uncaught ReferenceError: exports is not defined
 *  > Uncaught ReferenceError: require is not defined
 *
 * These two instructions create fake 'require' and fake 'export'
 * which should fix these problems.
 *
 * @date 2020-04-01
 **/

var exports = globalThis.export = globalThis;
var require = globalThis.require = function(...args) { return globalThis; };
