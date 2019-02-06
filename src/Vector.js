/**
 * A vector (vertex,vertex) implementation.
 *
 * @author  Ikaros Kappler
 * @date    2019-01-30
 * @version 1.0.0
 **/

(function(_context) {
    'use strict';
    
    /**
     * +---------------------------------------------------------------------------------
     * | The constructor.
     * |
     * @param {Vertex} vertA
     * @param {Vertex} vertB
     **/
    var Vector = function( vertA, vertB ) {
	Line.call(this,vertA,vertB);
    };
    Object.extendClass(Line,Vector);
    
    _context.Vector = Vector;
    
})(window ? window : module.export);
