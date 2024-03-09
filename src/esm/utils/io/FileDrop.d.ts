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
type IDroppedCallbackJSON = (jsonData: object) => void;
type IDroppedCallbackText = (textData: string) => void;
type IDroppedCallbackSVG = (svgDocument: Document) => void;
export declare class FileDrop {
    /**
     * The 'dropzone' element.
     * @private
     * @memberof FileDrop
     * @member {HTMLElement}
     */
    private element;
    /**
     * The JSON file drop callback.
     * @private
     * @memberof FileDrop
     * @member {HTMLElement}
     */
    private fileDroppedCallbackJSON;
    /**
     * The text file drop callback.
     * @private
     * @memberof FileDrop
     * @member {HTMLElement}
     */
    private fileDroppedCallbackText;
    /**
     * The binary file drop callback.
     * @private
     * @memberof FileDrop
     * @member {HTMLElement}
     */
    private fileDroppedCallbackBinary;
    /**
     * The SVG file drop callback.
     * @private
     * @memberof FileDrop
     * @member {HTMLElement}
     */
    private fileDroppedCallbackSVG;
    /**
     *
     * @param {HTMLElement} element - The element you wish to operate as the drop zone (like <body/>).
     */
    constructor(element: HTMLElement);
    /**
     * Install the JSON (MIME type json*) file drop callback. Note than only one callback can be installed
     * in this implementation. Calling this method multiple times will overwrite previously
     * installed listeners.
     *
     * The callback will receive the dropped file content as an object (parsed JSON).
     *
     * @param {(data:object)=>void} callback
     */
    onFileJSONDropped(callback: IDroppedCallbackJSON): void;
    /**
     * Install the text file (MIME type text/plain) drop callback. Note than only one callback can be installed
     * in this implementation. Calling this method multiple times will overwrite previously
     * installed listeners.
     *
     * The callback will receive the dropped file content as a string.
     *
     * @param {(data:object)=>void} callback
     */
    onFileTextDropped(callback: IDroppedCallbackText): void;
    onFileSVGDropped(callback: IDroppedCallbackSVG): void;
    /**
     * Internally handle a drop event.
     *
     * @param {DragEvent} event
     * @returns {void}
     */
    private handleDropEvent;
    /**
     * Toggles the drop sensitive element's opacity to 0.5.
     *
     * @param {DragEvent} event - The event.
     */
    private handleDragOverEvent;
    /**
     * Restored the drop sensitive element's opacity back to 1.0.
     *
     * @param {DragEvent} event - The event.
     */
    private handleDragLeaveEvent;
    /**
     * Removes all listeners (drop, dragover and dragleave).
     */
    destroy(): void;
}
export {};
