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
 * @modified 2021-01-26 Moving control points with center points
 * @modified 2024-03-10 Adding the `destory` method for properly removing installed listeners.
 * @version  1.1.0
 **/

import { CircleSector } from "../../CircleSector";
import { PlotBoilerplate } from "../../PlotBoilerplate";
import { VertEvent, VertListener } from "../../VertexListeners";
import { Vertex } from "../../Vertex";


/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export class CircleSectorHelper {

	private circleSector: CircleSector;
	private controlPointStart: Vertex;
	private controlPointEnd: Vertex;

	private centerListener: VertListener;
	private radiusStartListener : VertListener;
	private radiusEndListener : VertListener;

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

			this.circleSector = circleSector;
			this.controlPointStart = controlPointStart;
			this.controlPointEnd = controlPointEnd;

			this.circleSector.circle.center.listeners.addDragListener( this.centerListener = this._handleDragCenter() );
			this.controlPointStart.listeners.addDragListener( this.radiusStartListener = this._handleDragStartControlPoint() );
			this.controlPointEnd.listeners.addDragListener( this.radiusEndListener = this._handleDragEndControlPoint() );
	// circleSector.circle.center.listeners.addDragListener( (e:VertEvent) => {
	//     controlPointStart.add( e.params.dragAmount );
	//     controlPointEnd.add( e.params.dragAmount );
	// } );
	
	// controlPointStart.listeners.addDragListener( (e:VertEvent) => {
	//     circleSector.circle.radius = circleSector.circle.center.distance(controlPointStart);
	//     controlPointEnd.set( circleSector.circle.vertAt(circleSector.endAngle) );
	//     circleSector.startAngle = circleSector.circle.center.angle( controlPointStart );
	// } );

	// controlPointEnd.listeners.addDragListener( (e:VertEvent) => {
	//     circleSector.circle.radius = circleSector.circle.center.distance(controlPointEnd);
	//     controlPointStart.set( circleSector.circle.vertAt(circleSector.startAngle) );
	//     circleSector.endAngle = circleSector.circle.center.angle( controlPointEnd );
	// } );
	
    }

	/**
	 * Creates a new drag handler for the circle sector's center point.
	 *
	 * @private
	 * @method handleDragCenter
	 * @instance
	 * @memberof CircleSectorHelper
	 * @returns A new event handler.
	 */
	private _handleDragCenter() : VertListener {
		const _self = this;
		return (e:VertEvent) => {
			_self.controlPointStart.add( e.params.dragAmount );
			_self.controlPointEnd.add( e.params.dragAmount );
		} ;
	}
	
	/**
	 * Creates a new drag handler for the circle sector's start control point.
	 *
	 * @private
	 * @method _handleDragStartControlPoint
	 * @instance
	 * @memberof CircleSectorHelper
	 * @returns A new event handler.
	 */
	private _handleDragStartControlPoint() : VertListener{
		const _self = this;
		return (e:VertEvent) => {
			_self.circleSector.circle.radius = _self.circleSector.circle.center.distance(_self.controlPointStart);
			_self.controlPointEnd.set( _self.circleSector.circle.vertAt(_self.circleSector.endAngle) );
			_self.circleSector.startAngle = _self.circleSector.circle.center.angle( _self.controlPointStart );
		} 
	};

	/**
	 * Creates a new drag handler for the circle sector's end control point.
	 *
	 * @private
	 * @method _handleDragEndControlPoint
	 * @instance
	 * @memberof CircleSectorHelper
	 * @returns A new event handler.
	 */
	private _handleDragEndControlPoint() : VertListener {
		const _self = this;
		return (e:VertEvent) => {
			_self.circleSector.circle.radius = _self.circleSector.circle.center.distance(_self.controlPointEnd);
	    	_self.controlPointStart.set( _self.circleSector.circle.vertAt(_self.circleSector.startAngle) );
	    	_self.circleSector.endAngle = _self.circleSector.circle.center.angle( _self.controlPointEnd );
		} 
	};

  	/**
	 * Destroy this circle helper.
	 * The listeners will be removed from the circle sector's points.
	 *
	 * @method destroy
	 * @instance
	 * @memberof CircleSectorHelper
	 */
	public destroy() : void {
		this.circleSector.circle.center.listeners.removeDragListener( this.centerListener );
		this.controlPointStart.listeners.removeDragListener( this.radiusStartListener );
		this.controlPointEnd.listeners.removeDragListener( this.radiusEndListener );
	}

};



