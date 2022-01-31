"use strict";
/**
 * A basic IO handler for file drop (Drag-and-drop).
 *
 * @author   Ikaros Kappler
 * @date     2021-10-13
 * @modified 2022-01-31 (ported from the ngdg project, then generalized)
 * @version  2.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigIO = void 0;
var ConfigIO = /** @class */ (function () {
    /**
     *
     * @param {HTMLElement} element - The element you wish to operate as the drop zone (like <body/>).
     */
    function ConfigIO(element) {
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
            if (!event.dataTransfer.files || event.dataTransfer.files.length === 0) {
                // No files were dropped
                return;
            }
            if (event.dataTransfer.files.length > 1) {
                // Multiple file drop is not nupported
                return;
            }
            if (!_this.fileDroppedCallbackJSON) {
                // No handling callback defined.
                return;
            }
            if (event.dataTransfer.files[0]) {
                var file = event.dataTransfer.files[0];
                console.log("file", file);
                if (file.type.match(/json.*/) && _this.fileDroppedCallbackJSON) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        // Finished reading file data.
                        var jsonObject = JSON.parse(readEvent.target.result);
                        // TODO: what happens on fail?
                        _this.fileDroppedCallbackJSON(jsonObject);
                    };
                    reader.readAsText(file); // start reading the file data.
                }
                else if (file.type.match(/text\/plain.*/) && _this.fileDroppedCallbackText) {
                    var reader = new FileReader();
                    reader.onload = function (readEvent) {
                        // Finished reading file data.
                        _this.fileDroppedCallbackText(readEvent.target.result);
                    };
                    reader.readAsText(file); // start reading the file data.
                }
            }
        };
        this.handleDragOverEvent = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.element.style.opacity = "0.5";
        };
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
    ConfigIO.prototype.onFileJSONDropped = function (callback) {
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
    ConfigIO.prototype.onFileTextDropped = function (callback) {
        this.fileDroppedCallbackText = callback;
    };
    ConfigIO.prototype.destroy = function () {
        this.element.removeEventListener("drop", this.handleDropEvent);
        this.element.removeEventListener("dragover", this.handleDragOverEvent);
        this.element.removeEventListener("dragleave", this.handleDragLeaveEvent);
    };
    return ConfigIO;
}());
exports.ConfigIO = ConfigIO;
//# sourceMappingURL=DndFileHandler.js.map