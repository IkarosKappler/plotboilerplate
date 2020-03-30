/**
 * A wrapper class for draggable items (mostly vertices).
 * @private
 **/
var Draggable = /** @class */ (function () {
    function Draggable(item, typeName) {
        this.item = item;
        this.typeName = typeName;
        //this.vindex = null;
        //this.pindex = null;
        //this.cindex = null;
    }
    ;
    Draggable.prototype.isVertex = function () { return this.typeName == Draggable.VERTEX; };
    ;
    Draggable.prototype.setVIndex = function (vindex) { this.vindex = vindex; return this; };
    ;
    Draggable.VERTEX = 'vertex';
    return Draggable;
}());
