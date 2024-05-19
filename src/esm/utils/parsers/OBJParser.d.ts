/**
 * A simple wavefront OBJ parser.
 *
 * Inspired by
 *    https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html
 *
 * @param {*} handleVert
 * @param {*} handleFace
 *
 * @author Ikaros Kappler
 * @date 2021-04-21
 * @version 0.0.1
 */
type VertHandler = (x: number, y: number, z: number) => void;
type FaceHandler = (a: number, b: number, c: number) => void;
export declare class OBJParser {
    private handleVert;
    private handleFace;
    constructor(handleVert: VertHandler, handleFace: FaceHandler);
    private _seekEOL;
    private _handleLine;
    parse(arrayBuffer: ArrayBuffer): void;
}
export {};
