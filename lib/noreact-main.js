/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/cjs/NoReact.js":
/*!****************************!*\
  !*** ./src/cjs/NoReact.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoReact = void 0;
var TestApp_1 = __webpack_require__(/*! ./TestApp */ "./src/cjs/TestApp.js");
var createElement_1 = __webpack_require__(/*! ./createElement */ "./src/cjs/createElement.js");
var createRoot_1 = __webpack_require__(/*! ./createRoot */ "./src/cjs/createRoot.js");
exports.NoReact = {
    createRoot: createRoot_1._createRoot,
    createElement: createElement_1._createElement,
    TestApp: TestApp_1.TestApp
};
exports["default"] = exports.NoReact;
//# sourceMappingURL=NoReact.js.map

/***/ }),

/***/ "./src/cjs/TestApp.js":
/*!****************************!*\
  !*** ./src/cjs/TestApp.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TestApp = void 0;
var NoReact_1 = __webpack_require__(/*! ./NoReact */ "./src/cjs/NoReact.js");
var TestApp = function (name) {
    var click1 = function () {
        console.log("First clicked");
    };
    var click2 = function () {
        console.log("Second clicked");
    };
    var mouseEnter = function (event) {
        event.target.style["background-color"] = "grey";
    };
    var mouseOut = function (event) {
        event.target.style["background-color"] = "DeepSkyBlue";
    };
    return (NoReact_1.default.createElement("div", { className: "NoReact-main" },
        "Hello ",
        name,
        NoReact_1.default.createElement("div", { className: "NoReact-child-1", onClick: click1 }, "Hello Nested"),
        NoReact_1.default.createElement("div", { className: "NoReact-child-2", onClick: click2, onMouseEnter: mouseEnter, onMouseOut: mouseOut, style: { backgroundColor: "yellow" } }, "Hello Nested 2")));
};
exports.TestApp = TestApp;
//# sourceMappingURL=TestApp.js.map

/***/ }),

/***/ "./src/cjs/createElement.js":
/*!**********************************!*\
  !*** ./src/cjs/createElement.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * A function to create the root element of a NoReact app.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2025-06-25
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._createElement = void 0;
var interfaces_1 = __webpack_require__(/*! ./interfaces */ "./src/cjs/interfaces.js");
var _createElement = function (name, props) {
    var content = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        content[_i - 2] = arguments[_i];
    }
    //   console.log("_createElement", name);
    props = props || {};
    var rootNode = document.createElement(name);
    _addAttributes(rootNode, props);
    if (content && Array.isArray(content)) {
        content.forEach(function (child) {
            rootNode.append(child);
        });
    }
    return rootNode;
};
exports._createElement = _createElement;
var _addAttributes = function (rootNode, props) {
    Object.keys(props).forEach(function (key) {
        // console.log("key", key, "value", props[key]);
        var value = props[key];
        if (!key) {
            return; // Ignore empty keys
        }
        else {
            var keyLow = key.toLocaleLowerCase();
            if (keyLow === "classname") {
                rootNode.setAttribute("class", "".concat(value));
            }
            else if (key === "style") {
                //   console.log("Assigning styles", value);
                Object.assign(rootNode.style, value);
            }
            else if (keyLow.length > 2 && keyLow.startsWith("on") && interfaces_1.ClickHandlerNames.includes(keyLow)) {
                //   console.log("Adding listener for ", key, value);
                // This is probably a function
                // Remove the 'on' part
                var eventName = keyLow.substring(2);
                rootNode.addEventListener(eventName, value);
            }
            else {
                rootNode.setAttribute("".concat(key), "".concat(value));
            }
        }
    });
};
//# sourceMappingURL=createElement.js.map

/***/ }),

/***/ "./src/cjs/createRoot.js":
/*!*******************************!*\
  !*** ./src/cjs/createRoot.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * A function to create the root element of a NoReact app.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2025-06-25
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._createRoot = exports.RootNode = void 0;
var RootNode = /** @class */ (function () {
    function RootNode(rootHtmlElement) {
        this.rootHtmlNode = rootHtmlElement;
    }
    RootNode.prototype.render = function (content) {
        console.log("Render");
        this.rootHtmlNode.appendChild(content);
    };
    return RootNode;
}());
exports.RootNode = RootNode;
var _createRoot = function (rootHtmlElement) {
    return new RootNode(rootHtmlElement);
};
exports._createRoot = _createRoot;
//# sourceMappingURL=createRoot.js.map

/***/ }),

/***/ "./src/cjs/interfaces.js":
/*!*******************************!*\
  !*** ./src/cjs/interfaces.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClickHandlerNames = void 0;
exports.ClickHandlerNames = [
    "onclick",
    "onmouseover",
    "onmouseout",
    "onmouseenter",
    "onchange",
    "onclick",
    "onmouseover",
    "onmouseout",
    "onkeydown",
    "onload",
    "ontouchcancel",
    "ontouchend",
    "ontouchmove",
    "ontouchstart"
];
//# sourceMappingURL=interfaces.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/cjs/entry.js ***!
  \**************************/
// Expose all your components to the global scope here.

// First variant:
globalThis._createElement = (__webpack_require__(/*! ./createElement */ "./src/cjs/createElement.js")._createElement);


// Alternative variant: 
// you might wrap your components into a library.
// This is usually used to keep the gloal scope clean and avoid naming collisions
// with other libraries.
globalThis.NoReact = (__webpack_require__(/*! ./NoReact */ "./src/cjs/NoReact.js").NoReact);


// globalThis.TestApp = require("./TestApp").TestApp;
})();

/******/ })()
;
//# sourceMappingURL=noreact-main.js.map