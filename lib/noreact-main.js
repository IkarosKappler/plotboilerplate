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
var useRef_1 = __webpack_require__(/*! ./useRef */ "./src/cjs/useRef.js");
exports.NoReact = {
    createRoot: createRoot_1._createRoot,
    createElement: createElement_1._createElement,
    useRef: useRef_1.useRef,
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
    return (NoReact_1.default.createElement("div", { className: "NoReact-main", style: { padding: "3em" } },
        "Hello ",
        name,
        NoReact_1.default.createElement("div", { className: "NoReact-child-1", onClick: click1 }, "Hello Nested"),
        NoReact_1.default.createElement("div", { className: "NoReact-child-2", onClick: click2, onMouseEnter: mouseEnter, onMouseOut: mouseOut, style: { backgroundColor: "yellow" } }, "Hello Nested 2"),
        NoReact_1.default.createElement("div", null, ["A", "B", "C"].map(function (text) {
            return NoReact_1.default.createElement("div", null, text);
        }))));
};
exports.TestApp = TestApp;
//# sourceMappingURL=TestApp.js.map

/***/ }),

/***/ "./src/cjs/createElement.js":
/*!**********************************!*\
  !*** ./src/cjs/createElement.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * A function to create the root element of a NoReact app.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2025-06-25
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._createElement = void 0;
var interfaces_1 = __webpack_require__(/*! ./interfaces */ "./src/cjs/interfaces.js");
var useRef_1 = __webpack_require__(/*! ./useRef */ "./src/cjs/useRef.js");
/**
 * The main function to create new elements from their JSX defintion.
 *
 * @param {string} name - The node name, like 'div' or 'button' or 'p'.
 * @param {ElementProps} props - The attribte mapping to apply to the new node, like 'className', 'style', 'id'.
 * @param {IElementContent...} content - The node's content.
 * @returns
 */
var _createElement = function (name, props) {
    var content = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        content[_i - 2] = arguments[_i];
    }
    props = props || {};
    var newNode = document.createElement(name);
    _addAttributes(newNode, props);
    _addContent(newNode, content);
    return newNode;
};
exports._createElement = _createElement;
/**
 * A private helper function to add content to a newly created node.
 *
 * @param {HTMLElement} node - The node to add content to.
 * @param {IElementContent...} content - The content to add.
 * @returns
 */
var _addContent = function (node) {
    var content = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        content[_i - 1] = arguments[_i];
    }
    if (!content || !Array.isArray(content)) {
        return;
    }
    content.forEach(function (child) {
        if (typeof child === "undefined") {
            return;
        }
        if (Array.isArray(child)) {
            _addContent.apply(void 0, __spreadArray([node], child, false));
        }
        else if (typeof child === "string") {
            node.append(child);
        }
        else {
            // console.log("HTMLElement child", typeof child, child);
            node.appendChild(child);
        }
    });
};
/**
 * Apply node attribute (properties) to a newly created node.
 *
 * @param {HTMLElement} node - The node to apply the properties/attributes to.
 * @param {ElementProps} props - The attribute set.
 */
var _addAttributes = function (node, props) {
    Object.keys(props).forEach(function (key) {
        // console.log("key", key, "value", props[key]);
        if (!key) {
            return; // Ignore empty keys
        }
        else {
            var value = props[key];
            _addAttribute(node, key, value);
        }
    });
};
/**
 * Adds a single attribute to the newly created node.
 *
 * @param {HTMLElement} node - The node to add the attribute to.
 * @param {string} key - The attribute name, like 'className', 'style', 'id'.
 * @param {string | Function | CSSStyleSheet | Ref<HTMLElement | undefined>} value - The attribute's value.
 */
var _addAttribute = function (node, key, value) {
    if (!key) {
        return;
    }
    var keyLow = key.toLocaleLowerCase();
    if (keyLow === "classname") {
        node.setAttribute("class", "".concat(value));
    }
    else if (key === "style") {
        if (typeof value === "object") {
            Object.assign(node.style, value);
        }
        else {
            console.warn("Cannot assign CSS properties of type ".concat(typeof value, ". Please use an object with CSS mappings."));
        }
    }
    else if (key === "ref") {
        if (!(value instanceof useRef_1.Ref)) {
            console.warn("Warning, passed object is not a ref.");
        }
        if (!value.current) {
            value.current = node;
        }
        // No real attribute
    }
    else if (keyLow.length > 2 && keyLow.startsWith("on") && interfaces_1.ClickHandlerNames.includes(keyLow)) {
        // This is probably a function
        // Remove the 'on' part
        var eventName = keyLow.substring(2);
        node.addEventListener(eventName, value);
    }
    else {
        node.setAttribute("".concat(key), "".concat(value));
    }
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
    /**
     * In this implementation rendering just means to append the built JSX result to the DOM node.
     * @param {HTMLElement} content
     */
    RootNode.prototype.render = function (content) {
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
    "onchange",
    "onclick",
    "oninput",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onload",
    "onmouseover",
    "onmouseout",
    "onmouseenter",
    "onmouseover",
    "onmouseout",
    "ontouchcancel",
    "ontouchend",
    "ontouchmove",
    "ontouchstart",
    "onmousedown",
    "onmouseup"
];
//# sourceMappingURL=interfaces.js.map

/***/ }),

/***/ "./src/cjs/useRef.js":
/*!***************************!*\
  !*** ./src/cjs/useRef.js ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useRef = exports.Ref = void 0;
var Ref = /** @class */ (function () {
    function Ref(value) {
        this.current = value;
    }
    return Ref;
}());
exports.Ref = Ref;
var useRef = function () {
    return new Ref(undefined);
};
exports.useRef = useRef;
//# sourceMappingURL=useRef.js.map

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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