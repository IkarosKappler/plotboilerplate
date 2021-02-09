/**
 * The name says it.
 * 
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2020-12-20
 * @modified 2021-02-09 Ported to TypeScript.
 * @version  1.0.0
 */

import { Vertex } from "../Vertex";
import { XYCoords } from "../interfaces";

export const cloneVertexArray = ( vertices : Array<XYCoords> ) : Array<Vertex> => {
    const result : Array<Vertex> = [];
    for( var i = 0; i < vertices.length; i++ ) {
	result.push( new Vertex(vertices[i].x, vertices[i].y) );
    }
    return result;
};
