/**
 * A mutable point set datastructure for holding a finite but variable set of vertices.
 *
 * @date    2026-09-12
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
export class PointSet {
    constructor(pb) {
        this.dragListeners = [];
        this.pb = pb;
        this.points = [];
    }
    fireDragEvent() {
        this.dragListeners.forEach(listener => {
            listener();
        });
    }
    /**
     * Adds a random point to the point list.
     *
     * @name addRandomPoint
     * @instance
     * @override
     * @memberof PointSet
     * @return {void}
     */
    addRandomPoint(horizontalSafeArea = 0, verticalSafeArea = 0) {
        // this.addVertex(Vertex.randomVertex(this.pb.viewport()).scale(0.5));
        this.addVertex(this.pb.viewport().randomPoint(horizontalSafeArea, verticalSafeArea));
    }
    /**
     * Adds the given point/vertex to the point list.
     *
     * @name addVertex
     * @instance
     * @override
     * @memberof PointSet
     * @param {Vertex} vert - The vertex to add.
     * @return {void}
     */
    addVertex(vert) {
        this.points.push(vert);
        this.pb.add(vert);
        var _self = this;
        vert.listeners.addDragListener(function () {
            _self.fireDragEvent();
        });
        // vert.listeners.addDragListener(_self.fireDragEvent);
    }
    /**
     * Remove all vertices from this set and from the plotboilerplate instance.
     *
     * @name clear
     * @instance
     * @override
     * @memberof PointSet
     * @return {void}
     */
    clear() {
        for (var i = 0; i < this.points.length; i++) {
            this.pb.remove(this.points[i], false);
            // TODO: How to remove drag listener?
            //   this.points[i].listeners.removeDragListener(this.fireDragEvent);
        }
        this.points = [];
    }
    /**
     * Add or remove n random points; depends on the config settings.
     *
     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
     */
    randomPoints(pointCount, horizontalSafeArea = 0, verticalSafeArea = 0) {
        // Generate random points.
        for (var i = this.points.length; i < pointCount; i++) {
            this.addRandomPoint(horizontalSafeArea, verticalSafeArea);
        }
    }
    /**
     * Add random points and be sure they cover the whole viewport.
     *
     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
     */
    randomFullCover(pointCount) {
        this.clear();
        this.randomPoints(pointCount - 4, 0.0, 0.0); //, true, true);
        // Add 4 more points in the corners.
        var viewport = this.pb.viewport();
        this.addVertex(viewport.getNorthWestPoint());
        this.addVertex(viewport.getNorthEastPoint());
        this.addVertex(viewport.getSouthWestPoint());
        this.addVertex(viewport.getSouthEastPoint());
    }
    /**
     * Call when the desired number of points changes.
     **/
    updatePointCount(newPointCount, horizontalSafeArea = 0, verticalSafeArea = 0) {
        if (newPointCount > this.points.length) {
            this.randomPoints(newPointCount, horizontalSafeArea, verticalSafeArea);
        }
        // Do not clear ; no full cover ; do rebuild
        else if (newPointCount < this.points.length) {
            // Remove n-m points
            for (var i = newPointCount; i < this.points.length; i++) {
                this.pb.remove(this.points[i]);
            }
            // TODO: MOVE THIS TO THE PointSet class.
            this.points = this.points.slice(0, newPointCount);
            // TODO: also remove listeners?
            //   updateAnimator();
            //   rebuild();
        }
    }
}
//# sourceMappingURL=PointSet.js.map