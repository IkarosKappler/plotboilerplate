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
export class FileDrop {
    /**
     *
     * @param {HTMLElement} element - The element you wish to operate as the drop zone (like <body/>).
     */
    constructor(element) {
        /**
         * Internally handle a drop event.
         *
         * @param {DragEvent} event
         * @returns {void}
         */
        this.handleDropEvent = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.element.style.opacity = "1.0";
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
                const file = event.dataTransfer.files[0];
                // console.log("file", file);
                if (file.type.match(/json.*/) && this.fileDroppedCallbackJSON !== null) {
                    var reader = new FileReader();
                    reader.onload = (readEvent) => {
                        if (!readEvent.target) {
                            console.warn("Cannot process JSON ProgressEvent data: target is null.");
                            return;
                        }
                        // Finished reading file data.
                        const jsonObject = JSON.parse(readEvent.target.result);
                        // TODO: what happens on fail?
                        this.fileDroppedCallbackJSON && this.fileDroppedCallbackJSON(jsonObject);
                    };
                    reader.readAsText(file); // start reading the file data.
                }
                else if (file.type.match(/text\/plain.*/) && this.fileDroppedCallbackText) {
                    var reader = new FileReader();
                    reader.onload = (readEvent) => {
                        if (!readEvent.target) {
                            console.warn("Cannot process Text ProgressEvent data: target is null.");
                            return;
                        }
                        // Finished reading file data.
                        this.fileDroppedCallbackText && this.fileDroppedCallbackText(readEvent.target.result);
                    };
                    reader.readAsText(file); // start reading the file data.
                }
                else if (this.fileDroppedCallbackBinary) {
                    var reader = new FileReader();
                    reader.onload = (readEvent) => {
                        if (!readEvent.target) {
                            console.warn("Cannot process Binary ProgressEvent data: target is null.");
                            return;
                        }
                        // Finished reading file data.
                        this.fileDroppedCallbackBinary &&
                            this.fileDroppedCallbackBinary(new Blob([readEvent.target.result]), file);
                    };
                    reader.readAsBinaryString(file); // start reading the file data.
                }
                else if (this.fileDroppedCallbackSVG) {
                    var reader = new FileReader();
                    reader.onload = (readEvent) => {
                        if (!readEvent.target) {
                            console.warn("Cannot process SVG ProgressEvent data: target is null.");
                            return;
                        }
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(readEvent.target.result, "image/svg+xml");
                        // Finished reading file data.
                        this.fileDroppedCallbackSVG && this.fileDroppedCallbackSVG(doc);
                    };
                    reader.readAsText(file); // start reading the file data.
                }
            }
        };
        /**
         * Toggles the drop sensitive element's opacity to 0.5.
         *
         * @param {DragEvent} event - The event.
         */
        this.handleDragOverEvent = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.element.style.opacity = "0.5";
        };
        /**
         * Restored the drop sensitive element's opacity back to 1.0.
         *
         * @param {DragEvent} event - The event.
         */
        this.handleDragLeaveEvent = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.element.style.opacity = "1.0";
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
    onFileJSONDropped(callback) {
        this.fileDroppedCallbackJSON = callback;
    }
    /**
     * Install the text file (MIME type text/plain) drop callback. Note than only one callback can be installed
     * in this implementation. Calling this method multiple times will overwrite previously
     * installed listeners.
     *
     * The callback will receive the dropped file content as a string.
     *
     * @param {(data:object)=>void} callback
     */
    onFileTextDropped(callback) {
        this.fileDroppedCallbackText = callback;
    }
    onFileSVGDropped(callback) {
        this.fileDroppedCallbackSVG = callback;
    }
    /**
     * Removes all listeners (drop, dragover and dragleave).
     */
    destroy() {
        this.element.removeEventListener("drop", this.handleDropEvent);
        this.element.removeEventListener("dragover", this.handleDragOverEvent);
        this.element.removeEventListener("dragleave", this.handleDragLeaveEvent);
    }
}
//# sourceMappingURL=FileDrop.js.map