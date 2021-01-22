/**
 * @author   Ikaros Kappler
 * @modified 2021-01-22
 * @version  1.0.0
 */


/**
 * Easily handle circle sectors (mouse or touch) with this circle sector helper.
 *
 * The circle sector has the center point and two additional points to determine
 * radius, startAngle and endAngle.
 *
 * @author   Ikaros Kappler
 * @date     2021-01-22
 * @version  1.0.0
 **/

import { CircleSector } from "../../CircleSector";
import { PlotBoilerplate } from "../../PlotBoilerplate";
import { VertEvent } from "../../VertexListeners";
import { Vertex } from "../../Vertex";


/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
class CircleSectorHelper {

    /**
     * The constructor.
     *
     * @constructor
     * @name CircleSectorHelper
     * @param {CircleSector} circleSector - The circle sector to handle.
     * @param {Vertex} controlPointStart - A point to define the radius and start angle (distance and angle from center).
     * @param {Vertex} controlPointEnd - A point to define the radius and end angle (distance and angle from center).
     * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle sector and both points.
     **/
    constructor( circleSector:CircleSector,
		 controlPointStart:Vertex,
		 controlPointEnd:Vertex,
		 pb:PlotBoilerplate
	       ) {
	
	controlPointStart.listeners.addDragListener( (e:VertEvent) => {
	    circleSector.circle.radius = circleSector.circle.center.distance(controlPointStart);
	    controlPointEnd.set( circleSector.circle.vertAt(circleSector.endAngle) );
	    circleSector.startAngle = circleSector.circle.center.angle( controlPointStart );
	} );

	controlPointEnd.listeners.addDragListener( (e:VertEvent) => {
	    circleSector.circle.radius = circleSector.circle.center.distance(controlPointEnd);
	    controlPointStart.set( circleSector.circle.vertAt(circleSector.startAngle) );
	    circleSector.endAngle = circleSector.circle.center.angle( controlPointEnd );
	} );
	
    }
};



