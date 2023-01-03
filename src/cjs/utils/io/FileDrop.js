"use strict";
/**
 * A basic IO handler for file drop (Drag-and-drop).
 *
 * Example use:
 * ```javascript
 *  var body = document.getElememtByTagName("body")[0];
 *  var fileDrop = new FileDrop(body);
 *    fileDrop.onFileJSONDropped(function (jsonObject) {
 *    console.log("jsonObject", jsonObject);
 *  });
 * ```
 *
 * @author   Ikaros Kappler
 * @date     2021-10-13
 * @modified 2022-01-31 (ported from the ngdg project, then generalized)
 * @modified 2023-01-03 Fixing some minor type issues and adding SVG reading capabilities.
 * @version  2.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDrop = void 0;
var FileDrop = /** @class */ (function () {
    /**
     *
     * @param {HTMLElement} element - The element you wish to operate as the drop zone (like <body/>).
     */
    function FileDrop(element) {
        var _this = this;
        /**
         * Internally handle a drop event.
         *
         * @param {DragEvent} event
         * @returns {void}
         */
        this.handleDropEvent = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.element.style.opacity = "1.0";
            if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length === 0) {
                // No files were dropped
                return;
            }
            if (event.dataTransfer.files.length > 1) {
                // Multiple file drop is not nupported
                return;
            }
            // if (!this.fileDroppedCallbackJSON) {
            //   // No handling callback defined.
            //   return;
            // }
            if (event.dataTransfer.files[0]) {
                var file_1 = event.dataTransfer.files[0];
                // console.log("file", file);
                if (file_1.type.match(/json.*/) && _this.fileDroppedCallbackJSON !== null) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        if (!readEvent.target) {
                            console.warn("Cannot process JSON ProgressEvent data: target is null.");
                            return;
                        }
                        // Finished reading file data.
                        var jsonObject = JSON.parse(readEvent.target.result);
                        // TODO: what happens on fail?
                        _this.fileDroppedCallbackJSON && _this.fileDroppedCallbackJSON(jsonObject);
                    };
                    reader.readAsText(file_1); // start reading the file data.
                }
                else if (file_1.type.match(/text\/plain.*/) && _this.fileDroppedCallbackText) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        if (!readEvent.target) {
                            console.warn("Cannot process Text ProgressEvent data: target is null.");
                            return;
                        }
                        // Finished reading file data.
                        _this.fileDroppedCallbackText && _this.fileDroppedCallbackText(readEvent.target.result);
                    };
                    reader.readAsText(file_1); // start reading the file data.
                }
                else if (_this.fileDroppedCallbackBinary) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        if (!readEvent.target) {
                            console.warn("Cannot process Binary ProgressEvent data: target is null.");
                            return;
                        }
                        // Finished reading file data.
                        _this.fileDroppedCallbackBinary &&
                            _this.fileDroppedCallbackBinary(new Blob([readEvent.target.result]), file_1);
                    };
                    reader.readAsBinaryString(file_1); // start reading the file data.
                }
                else if (_this.fileDroppedCallbackSVG) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        if (!readEvent.target) {
                            console.warn("Cannot process SVG ProgressEvent data: target is null.");
                            return;
                        }
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(readEvent.target.result, "image/svg+xml");
                        // Finished reading file data.
                        _this.fileDroppedCallbackSVG && _this.fileDroppedCallbackSVG(doc);
                    };
                    reader.readAsText(file_1); // start reading the file data.
                }
            }
        };
        /**
         * Toggles the drop sensitive element's opacity to 0.5.
         *
         * @param {DragEvent} event - The event.
         */
        this.handleDragOverEvent = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.element.style.opacity = "0.5";
        };
        /**
         * Restored the drop sensitive element's opacity back to 1.0.
         *
         * @param {DragEvent} event - The event.
         */
        this.handleDragLeaveEvent = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.element.style.opacity = "1.0";
        };
        this.element = element;
        // Init the drop listeners
        element.addEventListener("drop", this.handleDropEvent.bind(this));
        element.addEventListener("dragover", this.handleDragOverEvent.bind(this));
        element.addEventListener("dragleave", this.handleDragLeaveEvent.bind(this));
    }
    /**
     * Install the JSON (MIME type json*) file drop callback. Note than only one callback can be installed
     * in this implementation. Calling this method multiple times will overwrite previously
     * installed listeners.
     *
     * The callback will receive the dropped file content as an object (parsed JSON).
     *
     * @param {(data:object)=>void} callback
     */
    FileDrop.prototype.onFileJSONDropped = function (callback) {
        this.fileDroppedCallbackJSON = callback;
    };
    /**
     * Install the text file (MIME type text/plain) drop callback. Note than only one callback can be installed
     * in this implementation. Calling this method multiple times will overwrite previously
     * installed listeners.
     *
     * The callback will receive the dropped file content as a string.
     *
     * @param {(data:object)=>void} callback
     */
    FileDrop.prototype.onFileTextDropped = function (callback) {
        this.fileDroppedCallbackText = callback;
    };
    FileDrop.prototype.onFileSVGDropped = function (callback) {
        this.fileDroppedCallbackSVG = callback;
    };
    /**
     * Removes all listeners (drop, dragover and dragleave).
     */
    FileDrop.prototype.destroy = function () {
        this.element.removeEventListener("drop", this.handleDropEvent);
        this.element.removeEventListener("dragover", this.handleDragOverEvent);
        this.element.removeEventListener("dragleave", this.handleDragLeaveEvent);
    };
    return FileDrop;
}());
exports.FileDrop = FileDrop;
//# sourceMappingURL=FileDrop.js.map