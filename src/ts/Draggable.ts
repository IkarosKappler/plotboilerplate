/**
 * A wrapper class for draggable items (mostly vertices).
 * @private
 **/
class Draggable {
    static VERTEX:string = 'vertex';
    item:any;
    typeName:string;
    vindex:number; // Vertex-index
    pindex:number; // Point-index (on curve)
    pid:number; // NOT IN USE (same as pindex?)
    cindex:number; // Curve-index
    constructor( item:any, typeName:string ) {
	this.item = item;
	this.typeName = typeName;
	//this.vindex = null;
	//this.pindex = null;
	//this.cindex = null;
    };
    isVertex() { return this.typeName == Draggable.VERTEX; };
    setVIndex(vindex:number):Draggable { this.vindex = vindex; return this; };
}
