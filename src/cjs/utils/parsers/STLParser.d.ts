/**
 * Refactored 3daddict's js-stl-parser.
 *
 * Found at
 *   https://github.com/3daddict/js-stl-parser/blob/master/index.js
 *
 * Refactoed by Ikaros Kappler
 *
 * @date 2021-04-16
 * @version 0.0.1
 */
export declare class STLParser {
    handleFacet: (v1: any, v2: any, v3: any) => void;
    /**
     * @param {function} handleFacet function(x,y,z)
     * */
    constructor(handleFacet: (v1: any, v2: any, v3: any) => void);
    _parseSTLString(stl: any): void;
    _parseSTLBinary(buf: any): void;
    /**
     *
     * @param {ArrayBuffer} buf
     * @returns
     */
    parse(buf: any): void;
}
