/**
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2020-12-20
 */

import { Vertex } from "../../Vertex";

/**
 * Remove all duplicate neighbours from the given polygon.
 *
 * Imagagine a polygon:
 * [ [0,0], [10,10], [10,10], [10,10], [20,20], [10,10], [30,30], [0,0] ]
 *
 * The returned vertex array will then be:
 * [ [10,10], [20,20], [10,10], [30,30], [0,0] ]
 *
 * Duplicate neighbours (and only neightours) of a run of any length will be removed.
 *
 * @method clearPolygonDuplicateVertices
 * @param {Array<Vertex>} vertices - The polygon vertices to use.
 * @param {number=0} epsilon - The epsilon area to use around each vertex to check equality.
 * @return {Array<Vertex>}
 */
export const clearPolygonDuplicateVertices = ( vertices:Array<Vertex>, epsilon?:number ) : Array<Vertex> => {
    const n : number = vertices.length;
    if( n === 0 )
	return [];
    
    // Find following up sequence of vertices that are inside the epsilon sphere.
    if( typeof epsilon === "undefined" )
	epsilon = 0;

    // Check if the verts a i and j are considered equal
    const equalVerts = ( i:number, j:number ) : boolean => {
	const vertA = vertices[i%n];
	const vertB = vertices[j%n];
	return (epsilon === 0 && vertA.x === vertB.x && vertA.y === vertB.y)
	    || (epsilon !== 0 && vertA.distance(vertB) <= epsilon );
    };

    // Find the next vertex in the list, starting from 'index', that is different
    const findEndOfRun = ( index:number ) : number => {
	var b : number = index;
	while( equalVerts(index,b+1) && b < index+n ) {
	    b++;
	}
	return b;
    };
    
    var start : number = findEndOfRun(0);
    // console.log('starting at', start );
    var i : number = 0;
    const result : Array<Vertex> = [];
    for( var j = i+1; j <= n; j++ ) {
	if( !equalVerts(start+i,start+j) ) {
	    result.push( vertices[(start+j)%n] );
	    i = j;
	}
    }
    return result;
};
