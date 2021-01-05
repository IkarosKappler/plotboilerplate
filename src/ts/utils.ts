/**
 * @author Ikaros Kappler
 * @date   2021-04-05
 */

import { drawutils } from "./draw";
import { drawutilsgl } from "./drawgl";
// import { Drawable } from "./interfaces";
import { BezierPath } from "./BezierPath";
// import { Bounds } from "./Bounds";
import { Circle } from "./Circle";
import { CircleSector } from "./CircleSector";
import { CubicBezierCurve } from "./CubicBezierCurve";
// import { Grid } from "./Grid";
// import { KeyHandler, XKeyListener } from "./KeyHandler";
import { Line } from "./Line";
// import { MouseHandler, XMouseEvent, XWheelEvent } from "./MouseHandler";
import { PBImage } from "./PBImage";
import { Polygon } from "./Polygon";
// import { SVGBuilder } from "./SVGBuilder";
import { Triangle } from "./Triangle";
import { VEllipse } from "./VEllipse";
import { Vector } from "./Vector";
import { Vertex } from "./Vertex";
// import { VertexAttr } from "./VertexAttr";
// import { VertEvent } from "./VertexListeners";
import { /*IBounds, IDraggable, Config, */ Drawable, DrawConfig /*, IHooks, PBParams, SVGSerializable, XYCoords, XYDimension*/ } from "./interfaces";

/**
 * Draw all drawables.
 *
 * This function is used by the main draw procedure and some further tools (like svg-draw).
 *
 * @method drawDrawables
 * @param {number} renderTime - The current render time. It will be used to distinct 
 *                              already draw vertices from non-draw-yet vertices.
 * @return {void}
 **/
export const drawDrawables = ( drawables:Array<Drawable>,
			       draw:drawutils|drawutilsgl, // TODO: put behind an interface
			       fill:drawutils|drawutilsgl,
			       drawConfig:DrawConfig,
			       renderTime:number,
			       _handleColor:(vertex:Vertex, color:string) => string
			     ) : void => {
    for( var i in drawables ) {
	var d : Drawable = drawables[i];
	if( d instanceof BezierPath ) {
	    for( var c in d.bezierCurves ) {
		draw.cubicBezier( d.bezierCurves[c].startPoint, d.bezierCurves[c].endPoint, d.bezierCurves[c].startControlPoint, d.bezierCurves[c].endControlPoint, drawConfig.bezier.color, drawConfig.bezier.lineWidth );

		if( drawConfig.drawBezierHandlePoints && drawConfig.drawHandlePoints ) {
		    if( !d.bezierCurves[c].startPoint.attr.bezierAutoAdjust ) {
			if( d.bezierCurves[c].startPoint.attr.visible )
			    draw.diamondHandle( d.bezierCurves[c].startPoint, 7, _handleColor(d.bezierCurves[c].startPoint,drawConfig.vertex.color) );
			d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
		    }
		    if( !d.bezierCurves[c].endPoint.attr.bezierAutoAdjust ) {
			if( d.bezierCurves[c].endPoint.attr.visible )
			    draw.diamondHandle( d.bezierCurves[c].endPoint, 7, _handleColor(d.bezierCurves[c].endPoint,drawConfig.vertex.color) );
			d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
		    }
		    if( d.bezierCurves[c].startControlPoint.attr.visible )
			draw.circleHandle( d.bezierCurves[c].startControlPoint, 3, _handleColor(d.bezierCurves[c].startControlPoint,'#008888') );
		    if( d.bezierCurves[c].endControlPoint.attr.visible )
			draw.circleHandle( d.bezierCurves[c].endControlPoint, 3, _handleColor(d.bezierCurves[c].endControlPoint,'#008888') );
		    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
		    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
		} else {
		    d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
		    d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
		    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
		    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
		}
		
		if( drawConfig.drawBezierHandleLines && drawConfig.drawHandleLines ) {
		    draw.line( d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint, drawConfig.bezier.handleLine.color, drawConfig.bezier.handleLine.lineWidth );
		    draw.line( d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint, drawConfig.bezier.handleLine.color, drawConfig.bezier.handleLine.lineWidth );
		}
		
	    }
	} else if( d instanceof Polygon ) {
	    draw.polygon( d, drawConfig.polygon.color, drawConfig.polygon.lineWidth );
	    if( !drawConfig.drawHandlePoints ) {
		for( var i in d.vertices ) {
		    d.vertices[i].attr.renderTime = renderTime;
		}
	    }
	} else if( d instanceof Triangle ) {
	    draw.polyline( [d.a,d.b,d.c], false, drawConfig.triangle.color, drawConfig.triangle.lineWidth );
	    if( !drawConfig.drawHandlePoints ) 
		d.a.attr.renderTime = d.b.attr.renderTime = d.c.attr.renderTime = renderTime;
	} else if( d instanceof VEllipse ) {
	    if( drawConfig.drawHandleLines ) {
		draw.line( d.center.clone().add(0,d.axis.y-d.center.y), d.axis, '#c8c8c8' );
		draw.line( d.center.clone().add(d.axis.x-d.center.x,0), d.axis, '#c8c8c8' );
	    }
	    draw.ellipse( d.center, Math.abs(d.axis.x-d.center.x), Math.abs(d.axis.y-d.center.y), drawConfig.ellipse.color,  drawConfig.ellipse.lineWidth );
	    if( !drawConfig.drawHandlePoints ) {
		d.center.attr.renderTime = renderTime;
		d.axis.attr.renderTime = renderTime;
	    }
	} else if( d instanceof Circle ) {
	    draw.circle( d.center, d.radius, drawConfig.circle.color, drawConfig.circle.lineWidth );
	} else if( d instanceof CircleSector ) {
	    draw.circleArc( d.circle.center, d.circle.radius, d.startAngle, d.endAngle, drawConfig.circleSector.color, drawConfig.circleSector.lineWidth );
	} else if( d instanceof Vertex ) {
	    if( drawConfig.drawVertices &&
		(!d.attr.selectable || !d.attr.draggable) && d.attr.visible ) {
		// Draw as special point (grey)
		draw.circleHandle( d, 7, drawConfig.vertex.color );
		d.attr.renderTime = renderTime;
	    }
	} else if( d instanceof Line ) {
	    draw.line( d.a, d.b, drawConfig.line.color, drawConfig.line.lineWidth );
	    if( !drawConfig.drawHandlePoints || !d.a.attr.selectable ) 
		d.a.attr.renderTime = renderTime;
	    if( !drawConfig.drawHandlePoints || !d.b.attr.selectable ) 
		d.b.attr.renderTime = renderTime;
	} else if( d instanceof Vector ) {
	    draw.arrow( d.a, d.b, drawConfig.vector.color );
	    if( drawConfig.drawHandlePoints && d.b.attr.selectable && d.b.attr.visible ) {
		draw.circleHandle( d.b, 3, '#a8a8a8' );
	    } else {
		d.b.attr.renderTime = renderTime;	
	    }
	    if( !drawConfig.drawHandlePoints || !d.a.attr.selectable ) 
		d.a.attr.renderTime = renderTime;
	    if( !drawConfig.drawHandlePoints || !d.b.attr.selectable ) 
		d.b.attr.renderTime = renderTime;
	    
	} else if( d instanceof PBImage ) {
	    if( drawConfig.drawHandleLines )
		draw.line( d.upperLeft, d.lowerRight, drawConfig.image.color, drawConfig.image.lineWidth );
	    fill.image( d.image, d.upperLeft, d.lowerRight.clone().sub(d.upperLeft) );
	    if( drawConfig.drawHandlePoints ) {
		draw.circleHandle( d.lowerRight, 3, drawConfig.image.color );
		d.lowerRight.attr.renderTime = renderTime;
	    }
	} else {
	    console.error( 'Cannot draw object. Unknown class.');
	}
    }
};
