var _this = this;
// NOT WORKING
var exposeClass = function (classObject) {
    // console.log( "exposeClass", classObject.constructor.name );
    (function (_context) {
        console.log("exposeClass", classObject, classObject.constructor);
        // const exposeClass : string = "TEST";
        _context[classObject.constructor.name] = classObject;
    })(typeof window !== 'undefined' ? window : _this);
};
//# sourceMappingURL=exposeClass.js.map