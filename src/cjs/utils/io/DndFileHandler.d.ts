/**
 * A basic IO handler for file drop (Drag-and-drop).
 *
 * @author   Ikaros Kappler
 * @date     2021-10-13
 * @modified 2022-01-31 (ported from the ngdg project, then generalized)
 * @version  2.0.0
 */
declare type IDroppedCallbackJSON = (jsonData: object) => void;
declare type IDroppedCallbackText = (textData: string) => void;
export declare class ConfigIO {
    /**
     * The 'dropzone' element.
     * @private
     * @memberof ConfigIO
     * @member {HTMLElement}
     */
    private element;
    /**
     * The JSON file drop callback.
     * @private
     * @memberof ConfigIO
     * @member {HTMLElement}
     */
    private fileDroppedCallbackJSON;
    private fileDroppedCallbackText;
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
    /**
     * Internally handle a drop event.
     *
     * @param {DragEvent} event
     * @returns {void}
     */
    private handleDropEvent;
    private handleDragOverEvent;
    private handleDragLeaveEvent;
    destroy(): void;
}
export {};
