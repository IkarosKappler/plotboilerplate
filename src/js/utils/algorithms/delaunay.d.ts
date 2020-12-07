/**
 * @modified_by Ikaros Kappler
 * @date_init   2012-10-17
 * @date        2017-07-31
 * @modified    2020-08-17 Ported from vanilla JS to TypeScript.
 * @version     2.0.1
 **/
import { Triangle } from "../../Triangle";
import { Vertex } from "../../Vertex";
import { Line as Edge } from "../../Line";
/**
 * @classdesc A Delaunay pointset triangulation implementation.  Inspired by
 *    http://www.travellermap.com/tmp/delaunay.htm
 *
 * License: Public Domain
 *          Original C++ code by Joshua Bell
 *
 * @requires Triangle
 * @requires Line
 * @requires Vertex
 */
export declare class Delaunay {
    private pointList;
    constructor(pointList: Array<Vertex>);
    triangulate(): Array<Triangle>;
    Triangulate(vertices: Array<Vertex>): Array<Triangle>;
    createBoundingTriangle(vertices: Array<Vertex>): Triangle;
    AddVertex(vertex: Vertex, triangles: Array<Triangle>): void;
    mkUniqueEdges(edges: Array<Edge>): Array<Edge>;
}
