/**
 * Refactored 3daddict's js-stl-parser.
 *
 * Found at
 *   https://github.com/3daddict/js-stl-parser/blob/master/index.js
 *
 * Refactored by Ikaros Kappler
 *
 * @date     2021-04-16
 * @modified 2024-03-09 Added type checks for Typescript 5 compatibility.
 * @version  0.0.2
 */
/**
 * Process a facet. Normals are not guaranteed to be present (binary yes, ascii no).
 */
type FacetHandler = (v1: Vertex, v2: Vertex, v3: Vertex, normal?: Vertex) => void;
declare class Vertex {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
}
/**
 * @classdesc STLParser
 */
export declare class STLParser {
    private handleFacet;
    /**
     * Create a new STLParser with the given callback fuction for facets.
     *
     * @param {function} handleFacet function(x,y,z)
     * @constructor
     * */
    constructor(handleFacet: FacetHandler);
    /**
     * Parse an stl string (ASCII).
     * @name _parseSTLString
     * @method _parseSTLString
     * @memberof STLParser
     * @param {string} stl
     * @private
     */
    private _parseSTLString;
    /**
     * Parse binary STL data.
     * @param {ArrayBuffer} buf
     */
    private _parseSTLBinary;
    /**
     * Parse any, binary or ascii, STL data.
     *
     * @name parse
     * @method parse
     * @member
     * @memberof STLParser
     * @param {ArrayBstringuffer} binaryOrAsciiString
     * @returns
     */
    parse(binaryOrAsciiString: string): void;
}
export {};
